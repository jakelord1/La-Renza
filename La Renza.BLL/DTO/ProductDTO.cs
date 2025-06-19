using La_Renza.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public int Quantity { get; set; }

        public SizeBase Size { get; set; }
        public ColorProductDTO Color { get; set; }
        public List<int>? UsersLikesId { get; set; }
    }
}
