using IMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Intern> Interns { get; set; }
        DbSet<ProgramTraining> ProgramTrainings { get; set; }
        DbSet<ProgramTrack> ProgramTracks { get; set; }
        DbSet<ProgramMentor> ProgramMentors { get; set; }
        DbSet<Lesson> Lessons { get; set; }
        DbSet<ReviewMessage> ReviewMessages { get; set; }
        DbSet<ReviewRequest> ReviewRequests { get; set; }
        DbSet<Notification> Notifications { get; set; }
        DbSet<RefreshToken> RefreshTokens { get; set; }

        EntityEntry Entry(object entity);

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
