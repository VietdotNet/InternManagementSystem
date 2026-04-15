using IMS.Application.DTOs.ManageLesson;
using IMS.Application.Interfaces.Repositories;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using IMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepo;

        public LessonService(ILessonRepository lessonRepo)
        {
            _lessonRepo = lessonRepo;
        }

        public async Task<List<Lesson>> GetLessonsByTrackAsync(int trackId)
        {
            return await _lessonRepo.GetLessonsByTrackAsync(trackId);
        }

        public async Task<Lesson?> GetByIdAsync(int lessonId)
        {
            return await _lessonRepo.GetByIdAsync(lessonId);
        }

        public async Task AddAsync(CreateLessonRequest request, CancellationToken cancellationToken)
        {
            var lesson = new Lesson
            {
                LessonName = request.LessonName,
                ProgramTrackId = request.ProgramTrackId,
                OrderIndex = request.OrderIndex
            };

            await _lessonRepo.CreateAsync(lesson);
            await _lessonRepo.SaveChangesAsync(cancellationToken);
        }

        public async Task<ServiceResult> UpdateAsync(
            int lessonId, 
            UpdateLessonRequest request, 
            CancellationToken cancellationToken)
        {
            var lesson = await _lessonRepo.GetByIdAsync(lessonId);

            if (lesson == null)
                return ServiceResult.Fail("Lesson is Not Found !");

            var originalRowVersion = Convert.FromBase64String(request.RowVersion);

            _lessonRepo.SetOriginalRowVersion(lesson, originalRowVersion);

            lesson.LessonName = request.LessonName;
            lesson.OrderIndex = request.OrderIndex;

            try
            {
                _lessonRepo.Update(lesson);
                await _lessonRepo.SaveChangesAsync(cancellationToken);
                return ServiceResult.Ok("Cập nhật thành công!");
            }
            catch (DbUpdateConcurrencyException)
            {
                return ServiceResult.Fail("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng reload!");
            }
        }

        public async Task<ServiceResult> DeleteAsync(int lessonId, CancellationToken cancellationToken)
        {
            var lesson = await _lessonRepo.GetByIdAsync(lessonId);
            if (lesson == null)
                return ServiceResult.Fail("Lesson is Not Found !");

            _lessonRepo.Delete(lesson);
            await _lessonRepo.SaveChangesAsync(cancellationToken);
            return ServiceResult.Ok("Delete lesson successfully!");
        }
    }
}
