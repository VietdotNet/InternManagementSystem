using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IMS.Application.Interfaces;
using IMS.Domain.Entities;

namespace IMS.Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {

        }

        public DbSet<Intern> Interns { get; set; }
        public DbSet<ProgramTraining> ProgramTrainings { get; set; }
        public DbSet<ProgramTrack> ProgramTracks { get; set; }
        public DbSet<ProgramMentor> ProgramMentors { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<ReviewMessage> ReviewMessages { get; set; }
        public DbSet<ReviewRequest> ReviewRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Intern>()
                .HasOne<AppUser>()
                .WithOne(u => u.Intern)
                .HasForeignKey<Intern>(i => i.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Intern>()
                .HasIndex(i => i.UserId)
                .IsUnique();

            builder.Entity<Intern>()
                .HasOne(i => i.ProgramTrack)
                .WithMany(t => t.Interns)
                .HasForeignKey(i => i.ProgramTrackId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProgramTrack>()
                .HasOne(t => t.ProgramTraining)
                .WithMany(p => p.ProgramTracks)
                .HasForeignKey(t => t.ProgramId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProgramMentor>()
                .HasKey(pm => new { pm.ProgramTrainingId, pm.UserId });

            builder.Entity<ProgramMentor>()
                .HasOne(pm => pm.ProgramTraining)
                .WithMany(p => p.ProgramMentors)
                .HasForeignKey(pm => pm.ProgramTrainingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProgramMentor>()
                .HasOne<AppUser>()
                .WithMany(m => m.ProgramMentors)
                .HasForeignKey(pm => pm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewRequest>()
                .HasOne<AppUser>()
                .WithMany()
                .HasForeignKey(r => r.InternId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewRequest>()
                .HasOne<AppUser>()
                .WithMany()
                .HasForeignKey(r => r.MentorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewMessage>()
                .HasOne(m => m.ReviewRequest)
                .WithMany(r => r.Messages)
                .HasForeignKey(m => m.ReviewRequestId);

            builder.Entity<Lesson>()
                .HasOne(l => l.ProgramTrack)
                .WithMany(t => t.Lessons)
                .HasForeignKey(l => l.ProgramTrackId);

            builder.Entity<ReviewRequest>()
                .HasOne(r => r.ProgramTrack)
                .WithMany()
                .HasForeignKey(r => r.ProgramTrackId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewRequest>()
                .HasOne(r => r.Lesson)
                .WithMany()
                .HasForeignKey(r => r.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Notification>(entity =>
            {
                entity.HasOne<AppUser>()
                    .WithMany()
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(n => n.ReviewRequest)
                    .WithMany()
                    .HasForeignKey(n => n.ReviewRequestId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.Property(n => n.Content)
                    .HasMaxLength(500)
                    .IsRequired();
            });
        }

    }
}
