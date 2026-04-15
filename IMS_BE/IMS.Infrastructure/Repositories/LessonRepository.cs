using IMS.Application.DTOs.ManageLesson;
using IMS.Application.Interfaces;
using IMS.Application.Interfaces.Repositories;
using IMS.Domain.Entities;
using IMS.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly IAppDbContext _context;

        public LessonRepository(IAppDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Lesson lesson)
        {
            await _context.Lessons.AddAsync(lesson);
        }


        public void Update(Lesson lesson)
        {
            _context.Lessons.Update(lesson);
        }

        public void Delete(Lesson lesson)
        {
            _context.Lessons.Remove(lesson);
        }

        public async Task<Lesson?> GetByIdAsync(int lessonId)
        {
            return await _context.Lessons
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Id == lessonId); ;
        }

        public async Task<List<Lesson>> GetLessonsByTrackAsync(int trackId)
        {
            return await _context.Lessons
            .Where(x => x.ProgramTrackId == trackId)
            .OrderBy(x => x.OrderIndex)
            .AsNoTracking()
            .ToListAsync();
        }

        public void SetOriginalRowVersion(object entity, byte[] rowVersion)
        {
            _context.Entry(entity)
                .Property("RowVersion")
                .OriginalValue = rowVersion;
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
