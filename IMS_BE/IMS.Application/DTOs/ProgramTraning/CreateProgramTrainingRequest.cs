using IMS.Application.DTOs.ManageUser;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ProgramTraning
{
    public class CreateProgramTrainingRequest
    {
        public string Name { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 mentor")]
        public List<string> SelectedMentorIds { get; set; } = new();

        [Required]
        [MinLength(1, ErrorMessage = "Phải thêm ít nhất 1 track")]
        public List<string> Tracks { get; set; } = null!;
    }
}
