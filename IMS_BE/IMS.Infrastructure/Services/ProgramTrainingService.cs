using IMS.Application.DTOs.ProgramTraning;
using IMS.Application.Interfaces.Repositories;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Entities;
using IMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class ProgramTrainingService : IProgramTrainingService
    {
        private readonly IProgramTrainingRepository _programTrainingRepo;
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ProgramTrainingService(
            IProgramTrainingRepository programTrainingRepo,
            AppDbContext context,
            UserManager<AppUser> userManager
            )
        {
            _programTrainingRepo = programTrainingRepo;
            _context = context;
            _userManager = userManager;
        }

        public async Task CloseProgramAsync(int programId)
        {
            var program = await _programTrainingRepo.GetByIdAsync(programId);
            if (program == null)
                throw new Exception("Program not found");

            program.IsClosed = true;
            await _context.SaveChangesAsync();
        }

        public async Task CreateAsync(CreateProgramTrainingRequest request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var program = new ProgramTraining
                {
                    Name = request.Name,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    IsClosed = false
                };
                await _programTrainingRepo.CreateAsync(program);
                await _programTrainingRepo.SaveChangesAsync(cancellationToken);

                var tracks = request.Tracks
                    .Where(t => !string.IsNullOrWhiteSpace(t))
                    .Select(t => new ProgramTrack
                    {
                        Name = t,
                        ProgramId = program.Id
                    }).ToList();

                if (tracks.Any())
                    await _programTrainingRepo.CreateTracksAsync(tracks);

                var mentors = request.SelectedMentorIds
               .Select(userId => new ProgramMentor
               {
                   ProgramTrainingId = program.Id,
                   UserId = userId,
                   AssignedAt = DateTime.Now
               }).ToList();

                if (mentors.Any())
                    await _programTrainingRepo.AddProgramMentorsAsync(mentors);

                await _programTrainingRepo.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync();

            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<ProgramItemResponse>> GetAllProgramAsync()
        {
            var programs = await _programTrainingRepo.GetAllProgramAsync();

            var userIds = programs
                .SelectMany(p => p.Mentors)
                .Select(m => m.Id)
                .Distinct()
                .ToList();

            var users = _userManager.Users
                .Where(u => userIds.Contains(u.Id))
                .ToList();

            foreach (var program in programs)
            {
                foreach (var mentor in program.Mentors)
                {
                    var user = users.FirstOrDefault(u => u.Id == mentor.Id);
                    if (user != null)
                    {
                        mentor.FullName = user.FullName;
                    }
                }
            }

            return programs;
        }

        public async Task<ProgramTraining?> GetByIdAsync(int programId)
        {
            return await _programTrainingRepo.GetByIdAsync(programId);
        }

        public async Task<List<TrackItemResponse>> GetTracksByProgramAsync(int programId)
        {
            return await _programTrainingRepo.GetTracksByProgramAsync(programId);
        }
    }
}
