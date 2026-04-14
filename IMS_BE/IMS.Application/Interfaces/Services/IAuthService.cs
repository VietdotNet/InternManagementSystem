using IMS.Application.DTOs.Auth;
using IMS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
        Task<ServiceResult> RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken);
        Task<LoginResponse> RefreshTokenAsync(string token, CancellationToken cancellationToken);
        Task<ServiceResult> SetPasswordAsync(SetPasswordRequest request, CancellationToken cancellationToken);

    }
}
