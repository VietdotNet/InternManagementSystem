using IMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ManageLesson
{
    public class LessonItemResponse
    {
        public int Id { get; set; }
        public string LessonName { get; set; }
        public ReviewStatus LessonStatus { get; set; }
        public int AttemptCount { get; set; } // Số lần đã request
        public bool CanRequest { get; set; }  // Có được request không
    }
}
