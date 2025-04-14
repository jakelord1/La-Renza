using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public int? OrderItemId { get; set; }
        public int? CommentId { get; set; }
        public string Name { get; set; }
        public ICollection<Product>? Products { get; set; }
        public OrderItem? OrderItem { get; set; }
        public Comment? Comment { get; set; }
    }
}
