using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class ModelProduct
    {
        public int Id { get; set; }
        public string Name { get; set; } // Model.Name
        public string? Description { get; set; }
        public string? MaterialInfo { get; set; }
        public DateTime StartDate { get; set; }
        public decimal Price { get; set; } // Model.Price
        public decimal? Rate { get; set; }
        public string ImageUrl { get; set; } // Color.Image.Url
        public List<string> Sizes { get; set; }
        public List<string> Bages { get; set; } // ["НОВИНКА"]
        public int CategoryId { get; set; }
    }

}
