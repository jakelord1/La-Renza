using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public int Quantity {  get; set; }
      
        public ICollection<Comment>? Comments { get; set; }
        public Color? Color { get; set; }
        public Size? Size { get; set; }

    }
}
