using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Repositories
{
    public interface ILessonRepository
    {
        Task<List<Lesson>> GetLessonsByTrackAsync(int trackId);
        Task<Lesson?> GetByIdAsync(int lessonId);
        Task CreateAsync(Lesson lesson);
        void Update(Lesson lesson);
        void SetOriginalRowVersion(object entity, byte[] rowVersion);
        void Delete(Lesson lesson);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
