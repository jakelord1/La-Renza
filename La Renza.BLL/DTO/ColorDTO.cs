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
        public int ImageId { get; set; }
        public ICollection<ImageDTO> Photos { get; set; }
        public int ModelId { get; set; }
    }
}
