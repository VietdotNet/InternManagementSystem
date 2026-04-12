using IMS.Application.Interfaces;
using IMS.Application.Interfaces.Repositories;
using IMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IAppDbContext _context;

        public UserRepository(IAppDbContext context)
        {
            _context = context;
        }
        public async Task CreateInternAsync(Intern intern)
        {
            await _context.Interns.AddAsync(intern);
        }

        public void UpdateInternAsync(Intern intern)
        {
            _context.Interns.Update(intern);
        }

        public async Task<Intern?> GetInternByIdAsync(string userId)
        {
            return await _context.Interns
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId);

        }
        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
