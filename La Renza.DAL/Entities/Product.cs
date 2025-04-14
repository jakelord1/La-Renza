using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public string Code { get; set; }
        public OrderItem? OrderItem { get; set; }
        public ICollection<ProductImage>? ImageProducts { get; set; }
        public ICollection<Category>? Categories { get; set; }
        public ICollection<Model>? Models { get; set; }
        public ICollection<Color>? Colors { get; set; }
        public ICollection<Size>? Sizes { get; set; }
        public ICollection<User>? Users { get; set; }
        public ICollection<Comment>? Comments { get; set; }
    }
}
