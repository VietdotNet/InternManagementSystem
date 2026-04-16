using Google.Apis.Auth;
using IMS.Application.DTOs.Auth;
using IMS.Application.Interfaces.Persistence;
using IMS.Application.Interfaces.Repositories;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using IMS.Domain.Enums;
using IMS.Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
using System.Threading;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly JwtSetting _jwt;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IRefreshTokenRepository _refreshRepo;
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration _config;

        public AuthService
        (
            IOptions<JwtSetting> options,
            UserManager<AppUser> userManager,
            IRefreshTokenRepository refreshRepo,
            IUserRepository userRepo,
            SignInManager<AppUser> signInManager,
            IConfiguration config

        )
        {
            _jwt = options.Value;
            _userManager = userManager;
            _refreshRepo = refreshRepo;
            _userRepo = userRepo;
            _signInManager = signInManager;
            _config = config;
        }

        public async Task<LoginResponse> LoginAsync(
            LoginRequest request, 
            CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email");

            var isValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isValid)
                throw new UnauthorizedAccessException("Invalid password");

            var response = await JwtAuthenticationAsync(user, cancellationToken);
            return response;

        }

        public async Task<LoginResponse> LoginWithGoogleAsync(
            GoogleLoginRequest request, 
            CancellationToken cancellationToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["GoogleAuth:ClientId"] }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

            if (payload == null || string.IsNullOrEmpty(payload.Email))
                throw new UnauthorizedAccessException("Invalid Google token or missing email.");

            var user = await _userManager.Users
                .Include(u => u.Intern)
                .FirstOrDefaultAsync(u => u.Email == payload.Email, cancellationToken);

            if (user == null)
                throw new UnauthorizedAccessException("Access Denied");


            if (user.Intern.Status == InternStatus.Deactivated)
                throw new UnauthorizedAccessException("Account is deactivated.");

            if (!user.EmailConfirmed)
            {
                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);
            }

            var logins = await _userManager.GetLoginsAsync(user);

            if (!logins.Any(l => l.LoginProvider == "Google"))
            {
                await _userManager.AddLoginAsync(user,
                    new UserLoginInfo("Google", payload.Subject, "Google"));
            }

            await _signInManager.SignInAsync(user, isPersistent: false);

            var response = await JwtAuthenticationAsync(user, cancellationToken);

            return response;
        }

        private async Task<LoginResponse> JwtAuthenticationAsync(
            AppUser user,
            CancellationToken cancellationToken)
        {
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

            

            var newToken = new RefreshToken
            {
                UserId = existing.UserId,
                TokenHash = newHash,
                ExpiryDate = DateTime.Now.AddDays(_jwt.RefreshTokenDays),
                CreatedAt = DateTime.Now,
                IsRevoked = false
            };

            _refreshRepo.Update(existing);

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

        public async Task<ServiceResult> SetPasswordAsync(SetPasswordRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.Token))
                return ServiceResult.Fail("Link không hợp lệ");

            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
                return ServiceResult.Fail("Invalid user");

            if (user.PasswordHash != null)
                return ServiceResult.Fail("Tài khoản đã được kích hoạt");

            string decodedToken;
            try
            {
                decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            }
            catch
            {
                return ServiceResult.Fail("Invalid Token");
            }

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.Password);

            if (!result.Succeeded)
                return ServiceResult.Fail(string.Join(", ", result.Errors.Select(e => e.Description)));

            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);

            if (await _userManager.IsInRoleAsync(user, "Intern"))
            {
                var intern = await _userRepo.GetInternByIdAsync(user.Id);
                if (intern != null)
                {
                    intern.JoinDate = DateTime.Now;
                    intern.Status = InternStatus.Active;

                    await _userRepo.SaveChangesAsync(cancellationToken);
                }
            }

            return ServiceResult.Ok("Thiết lập mật khẩu thành công");
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
                Audience = _jwt.Audience,
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
