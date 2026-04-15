using IMS.Application.DTOs.Auth;
using IMS.Application.Interfaces.Services;
using IMS.Infrastructure.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace IMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly JwtSetting _jwt;

        public AuthController
        (
            IAuthService authService,
            IOptions<JwtSetting> options
        )
        {
            _authService = authService;
            _jwt = options.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequest req, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                    return BadRequest("Email and password required!");

                var auth = await _authService.LoginAsync(req, cancellationToken);

                SetAccessTokenCookie(auth.AccessToken);
                SetRefreshTokenCookie(auth.RefreshToken);

                return Ok(new
                {
                    accessToken = auth.AccessToken,
                    accessTokenExpiryDate = auth.AccessTokenExpiryDate,
                    tokenType = "Bearer",
                    message = "Login successful!"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync(CancellationToken cancellationToken)
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "No refresh token found" });

            var result = await _authService.RevokeTokenAsync(refreshToken, cancellationToken);

            if (!result.Success)
                return BadRequest(result.Message);

            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            Response.Cookies.Delete("refresh_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(result.Message);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RotatingRefreshTokenAsync(CancellationToken cancellationToken)
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            try
            {
                var result = await _authService.RefreshTokenAsync(refreshToken, cancellationToken);

                SetAccessTokenCookie(result.AccessToken);
                SetRefreshTokenCookie(result.RefreshToken);

                return Ok(new
                {
                    accessToken = result.AccessToken,
                    expiresAt = result.AccessTokenExpiryDate
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPasswordAsync(SetPasswordRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.SetPasswordAsync(request, cancellationToken);

            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { Message = "Invalid token: missing email." });

            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var roleName = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                Email = email,
                Name = name,
                RoleName = roleName
            });
        }

        private void SetAccessTokenCookie(string accessToken)
        {
            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(_jwt.AccessTokenMinutes)
            });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(_jwt.RefreshTokenDays)
            });
        }

    }
}
