using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class AddCartByModel
    {
        public int ModelId { get; set; }
        public string SizeName { get; set; }
        public int Quantity { get; set; }
    }
}
