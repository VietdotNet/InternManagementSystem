using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Persistence
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> ExistingRefreshTokenAsync(string userId);
        Task CreateAsync(RefreshToken refreshToken);
        void Update(RefreshToken refreshToken);
        Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
        Task SaveChangesAsync(CancellationToken cancellationToken);

    }
}
