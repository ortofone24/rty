using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Rekat.Models
{
    public class PierwiastkiPriceModel
    {
        [Key]
        public int PriceId { get; set; }

        [Required]
        public double PalladPrice { get; set; }

        [Required]
        public double RodPrice { get; set; }

        [Required]
        public double PlatynaPrice { get; set; }
    }
}
