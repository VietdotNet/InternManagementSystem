using IMS.Application.DTOs.ManageLesson;
using IMS.Domain.Common;
using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Services
{
    public interface ILessonService
    {
        Task<List<Lesson>> GetLessonsByTrackAsync(int trackId);
        Task<Lesson?> GetByIdAsync(int lessonId);
        Task AddAsync(CreateLessonRequest request, CancellationToken cancellationToken);
        Task<ServiceResult> UpdateAsync(int lessonId, UpdateLessonRequest request, CancellationToken cancellationToken);
        Task<ServiceResult> DeleteAsync(int lessonId, CancellationToken cancellationToken);
    }
}
