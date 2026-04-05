using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class ReviewMessage
    {
        public int Id { get; set; }
        public int ReviewRequestId { get; set; }
        public string SenderId { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public ReviewRequest ReviewRequest { get; set; } = null!;
    }
}
