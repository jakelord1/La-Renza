using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    internal class ColorDTO
    {
        int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public ICollection<string> Photos { get; set; }
        public ModelDTO Model { get; set; }
    }
}
