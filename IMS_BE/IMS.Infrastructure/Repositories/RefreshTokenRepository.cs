using IMS.Application.Interfaces;
using IMS.Application.Interfaces.Persistence;
using IMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly IAppDbContext _context;

        public RefreshTokenRepository(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> ExistingRefreshTokenAsync(string userId)
        {
            return await _context.RefreshTokens
                .AsNoTracking()
                .SingleOrDefaultAsync(r => r.UserId == userId && 
                    !r.IsRevoked && r.ExpiryDate > DateTime.Now);
        }

        public async Task CreateAsync(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
        }

        public void Update(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
        }

        public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
        {
            return await _context.RefreshTokens
                .SingleOrDefaultAsync(r => r.TokenHash == tokenHash);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
