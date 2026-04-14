using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task CreateInternAsync(Intern intern);
        void UpdateInternAsync(Intern intern);
        Task<Intern?> GetInternByIdAsync(string userId);

        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
