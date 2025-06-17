using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class FavoriteProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } // Model.Name
        public decimal Price { get; set; } // Model.Price
        public string ImageUrl { get; set; } // Color.Image.Url
        public bool InStock { get; set; } // Quantity > 0
        public List<string> Sizes { get; set; }
        public List<string> Badges { get; set; } // ["НОВИНКА"]
    }

}
