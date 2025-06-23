using La_Renza.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class ModelDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? MaterialInfo { get; set; }
        public DateTime StartDate { get; set; }
        public decimal Price { get; set; }
        public decimal? Rate { get; set; }
        public string? Bage { get; set; }

        public ICollection<ColorDTO> Colors { get; set; }
        public ICollection<ImageDTO> Photos { get; set; }
        public int CategoryId { get; set; }
        public List<string> Sizes { get; set; } = new();
    }
}
