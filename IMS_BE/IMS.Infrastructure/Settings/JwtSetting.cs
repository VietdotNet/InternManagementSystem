using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Settings
{
    public class JwtSetting
    {
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
        public string Secret { get; set; } = null!;
        public int AccessTokenMinutes { get; set; } = 10;
        public int RefreshTokenDays { get; set; } = 30;
    }
}
