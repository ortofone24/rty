using System.ComponentModel.DataAnnotations;

namespace Rekat.Models
{
    public class ImageModel
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public string ImageTempUrl { get; set; }
    }
}


