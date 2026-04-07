using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;

        public string TokenHash { get; set; } = null!;

        public DateTime ExpiryDate { get; set; }

        public bool IsRevoked { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ReplacedByToken { get; set; }

        public string? RevokedReason { get; set; }

        public bool IsExpired => DateTime.Now >= ExpiryDate;

        public bool IsActive => !IsRevoked && !IsExpired;
    }
}
