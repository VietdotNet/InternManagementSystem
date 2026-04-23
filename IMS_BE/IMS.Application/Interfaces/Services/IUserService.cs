using IMS.Application.DTOs.ManageUser;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<ServiceResult> CreateMentorAsync(CreateMentorRequest request, string baseUrl);
        Task<ServiceResult> CreateInternAsync(CreateInternRequest request, string baseUrl, CancellationToken cancellationToken);
        Task<Intern?> GetInternByIdAsync(string userId);
        Task<ServiceResult> DeactivateInternAsync(string internId, CancellationToken cancellationToken);
        Task<IList<MentorResponse>> GetAllMentorsAsync();
    }
}
