using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class ColorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ModelId { get; set; }
        public int ImageId { get; set; }
        public ImageDTO Image { get; set; }
        public ModelBase Model { get; set; }
    }
    public class ColorProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ModelId { get; set; }
        public int ImageId { get; set; }
        public ImageDTO Image { get; set; }
        public ModelBase Model { get; set; }
    }
}
