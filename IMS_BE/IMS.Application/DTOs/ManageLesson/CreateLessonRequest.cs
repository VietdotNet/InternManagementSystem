using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ManageLesson
{
    public class CreateLessonRequest
    {
        public int ProgramTrackId { get; set; }
        public string LessonName { get; set; } = null!;
        public int OrderIndex { get; set; }
    }
}
