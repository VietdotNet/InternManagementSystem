using IMS.Application.DTOs.ProgramTraning;
using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Repositories
{
    public interface IProgramTrainingRepository
    {
        Task CreateAsync(ProgramTraining program);
        Task CreateTracksAsync(List<ProgramTrack> tracks);
        Task AddProgramMentorsAsync(List<ProgramMentor> mentors);
        Task<ProgramTraining?> GetByIdAsync(int programId);
        Task<List<ProgramItemResponse>> GetAllProgramAsync();
        Task<List<TrackItemResponse>> GetTracksByProgramAsync(int programId);
        Task<List<ProgramItemResponse>> GetProgramByMentorIdAsync(string mentorId);
        Task<ProgramTraining?> GetDetailByIdAsync(int programId);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
