using System.ComponentModel.DataAnnotations;

namespace Rekat.Models
{
    public class ProductModel
    {
        [Key]
        public int KatId { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public int KatNumber { get; set; }

        [Required]
        public double PlatynaWeight { get; set; }

        [Required]
        public double PalladWeight { get; set; }

        [Required]
        public double RodWeight { get; set; }

        [Required]
        public double KatPrice { get; set; }

        [Required]
        public double KatWeigthPerKg { get; set; }
    }
}
