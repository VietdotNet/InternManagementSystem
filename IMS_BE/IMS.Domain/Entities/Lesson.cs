using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class Lesson
    {
        public int Id { get; set; }
        public int ProgramTrackId { get; set; }
        public string LessonName { get; set; } = null!;
        public int OrderIndex { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
        public ProgramTrack ProgramTrack { get; set; } = null!;
        public ICollection<ReviewRequest> ReviewRequests { get; set; } = new List<ReviewRequest>();
    }
}
