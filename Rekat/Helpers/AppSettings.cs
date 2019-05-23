using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rekat.Helpers
{
    public class AppSettings
    {
        // Properties for JWT Token Signature
        public string Site { get; set; }
        public string Audience { get; set; }
        public string ExpireTime { get; set; }
        public string Secret { get; set; }

        // Sendgrid
        public string SendGridUser { get; set; }
        public string SendGridKey { get; set; }
    }
}
