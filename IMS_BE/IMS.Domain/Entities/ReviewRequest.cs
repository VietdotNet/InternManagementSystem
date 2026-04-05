using IMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class ReviewRequest
    {
        public int Id { get; set; }
        public string InternId { get; set; } = null!;
        public string MentorId { get; set; } = null!;

        public int ProgramTrackId { get; set; }
        public int LessonId { get; set; }

        public int Attempt { get; set; }
        public string Note { get; set; } = null!;
        public string? NoteByMentor { get; set; }
        public double? Score { get; set; }
        public ReviewStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ProgramTrack ProgramTrack { get; set; } = null!;
        public Lesson Lesson { get; set; } = null!;

        public ICollection<ReviewMessage> Messages { get; set; } = new List<ReviewMessage>();
    }
}
