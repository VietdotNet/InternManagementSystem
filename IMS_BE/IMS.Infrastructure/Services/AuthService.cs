using IMS.Application.DTOs.Auth;
using IMS.Application.Interfaces.Persistence;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using IMS.Domain.Enums;
using IMS.Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly JwtSetting _jwt;
        private readonly UserManager<AppUser> _userManager;
        private readonly IRefreshTokenRepository _refreshRepo;

        public AuthService
        (
            IOptions<JwtSetting> options,
            UserManager<AppUser> userManager,
            IRefreshTokenRepository refreshRepo
        )
        {
            _jwt = options.Value;
            _userManager = userManager;
            _refreshRepo = refreshRepo;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email");

            var isValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isValid)
                throw new UnauthorizedAccessException("Invalid password");

            var accessToken = await GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenHash = ComputeSha256Hash(refreshToken);

            var existingRefreshToken = await _refreshRepo.ExistingRefreshTokenAsync(user.Id);

            if (existingRefreshToken != null)
            {
                existingRefreshToken.IsRevoked = true;
                existingRefreshToken.RevokedReason = RevokedReasons.Replaced;
                existingRefreshToken.ReplacedByToken = refreshTokenHash;

                 _refreshRepo.Update(existingRefreshToken);
            }

             var newToken = new RefreshToken
             {
                 UserId = user.Id,
                 TokenHash = refreshTokenHash,
                 ExpiryDate = DateTime.Now.AddDays(_jwt.RefreshTokenDays),
                 CreatedAt = DateTime.Now,
                 IsRevoked = false
             };

                await _refreshRepo.CreateAsync(newToken);
                await _refreshRepo.SaveChangesAsync(cancellationToken);


            return new LoginResponse
            {
                AccessToken = accessToken.Token,
                AccessTokenExpiryDate = accessToken.ExpiryDate,
                RefreshToken = refreshToken
            };

        }

        public async Task<ServiceResult> RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken)
        {
            var tokenHash = ComputeSha256Hash(refreshToken);

            var token = await _refreshRepo.GetByTokenHashAsync(tokenHash);
            if (token == null) 
                return ServiceResult.Fail("Refresh token is not found!");
            if (token.IsRevoked)
                return ServiceResult.Fail("Refresh token was revoked!");
 
            token.IsRevoked = true;
            token.RevokedReason = RevokedReasons.Logout;

            _refreshRepo.Update(token);
            await _refreshRepo.SaveChangesAsync(cancellationToken);

            return ServiceResult.Ok("Logout successful!");
        }

        public async Task<LoginResponse> RefreshTokenAsync(string token, CancellationToken cancellationToken)
        {
            var tokenHash = ComputeSha256Hash(token);

            var existing = await _refreshRepo.GetByTokenHashAsync(tokenHash);

            if (existing == null || existing.IsRevoked || existing.ExpiryDate <= DateTime.Now)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await _userManager.FindByIdAsync(existing.UserId);

            if (user == null)
                throw new UnauthorizedAccessException("Invalid user");

            // Rotate: revoke existing and create new
            var newRefreshToken = GenerateRefreshToken();
            var newHash = ComputeSha256Hash(newRefreshToken);

            existing.IsRevoked = true;
            existing.RevokedReason = RevokedReasons.Replaced;
            existing.ReplacedByToken = newHash;

            _refreshRepo.Update(existing);

            var newToken = new RefreshToken
            {
                UserId = existing.UserId,
                TokenHash = newHash,
                ExpiryDate = DateTime.Now.AddDays(_jwt.RefreshTokenDays),
                CreatedAt = DateTime.Now,
                IsRevoked = false
            };

            await _refreshRepo.CreateAsync(newToken);
            await _refreshRepo.SaveChangesAsync(cancellationToken);

            var accessToken = await GenerateJwtTokenAsync(user);

            return new LoginResponse
            {
                AccessToken = accessToken.Token,
                AccessTokenExpiryDate = accessToken.ExpiryDate,
                RefreshToken = newRefreshToken
            };
        }

        private async Task<(string Token, DateTime ExpiryDate)> GenerateJwtTokenAsync(AppUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwt.Secret);

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName ?? user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (roles != null && roles.Any())
            {
                claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
            }


            var expires = DateTime.Now.AddMinutes(_jwt.AccessTokenMinutes);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                Issuer = _jwt.Issuer,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return (tokenString, expires);
        }

        private static string GenerateRefreshToken()
        {
            // 64 bytes -> base64 length ~88 chars.
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private static string ComputeSha256Hash(string raw)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(raw);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
