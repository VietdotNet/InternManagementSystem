using IMS.Application.DTOs.ManageLesson;
using IMS.Application.DTOs.ManageUser;
using IMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ProgramTraning
{
    public class ProgramTrackResponse
    {
        public int TrackId { get; set; }
        public string TrackName { get; set; } = null!;
        public List<InternItemResponse> Interns { get; set; }
        public List<LessonItemResponse> Lessons { get; set; }
    }
}
