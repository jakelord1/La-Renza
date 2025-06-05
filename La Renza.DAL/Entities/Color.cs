using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Color
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public int ModelId { get; set; }
        public int ImageId { get; set; }
        public Image Image { get; set; }

        public Model Model { get; set; }

    }
}
