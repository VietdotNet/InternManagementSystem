using IMS.Application.DTOs.ProgramTraning;
using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Services
{
    public interface IProgramTrainingService
    {
        Task CreateAsync(CreateProgramTrainingRequest request, CancellationToken cancellationToken);
        Task<List<ProgramItemResponse>> GetAllProgramAsync();
        Task<ProgramTraining?> GetByIdAsync(int programId);
        Task<List<TrackItemResponse>> GetTracksByProgramAsync(int programId);
        Task CloseProgramAsync(int programId);
    }
}
