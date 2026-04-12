using IMS.Application.DTOs.ManageUser;
using IMS.Application.DTOs.ProgramTraning;
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
    public class ProgramTrainingRepository : IProgramTrainingRepository
    {
        private readonly IAppDbContext _context;

        public ProgramTrainingRepository(IAppDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(ProgramTraining program)
        {
            await _context.ProgramTrainings.AddAsync(program);
        }

        public async Task CreateTracksAsync(List<ProgramTrack> tracks)
        {
            await _context.ProgramTracks.AddRangeAsync(tracks);
        }

        public async Task AddProgramMentorsAsync(List<ProgramMentor> mentors)
        {
            await _context.ProgramMentors.AddRangeAsync(mentors);
        }

        public async Task<ProgramTraining?> GetByIdAsync(int programId)
        {
            return await _context.ProgramTrainings
                .FindAsync(programId);
        }

        public async Task<List<ProgramItemResponse>> GetAllProgramAsync()
        {
            return await _context.ProgramTrainings
                .Select(m => new ProgramItemResponse
                {
                    ProgramId = m.Id,
                    ProgramName = m.Name,
                    StartDate = m.StartDate,
                    EndDate = m.EndDate,
                    InternCount = m.ProgramTracks
                        .SelectMany(t => t.Interns)
                        .Count(),
                    MentorCount = m.ProgramMentors
                        .Count(),
                    IsClosed = m.IsClosed,

                    Tracks = m.ProgramTracks
                        .Select(t => t.Name)
                        .ToList(),

                    Mentors = m.ProgramMentors
                        .Select(pm => new MentorResponse
                        {
                            Id = pm.UserId,
                            FullName = ""
                        })
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<List<TrackItemResponse>> GetTracksByProgramAsync(int programId)
        {
            return await _context.ProgramTracks
               .AsNoTracking()
               .Where(x => x.ProgramId == programId)
               .Select(x => new TrackItemResponse 
               { 
                   Id = x.Id,
                   Name = x.Name,
               })
               .ToListAsync();
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
