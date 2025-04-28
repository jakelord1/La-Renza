using La_Renza.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    internal class ModelDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? MaterialInfo { get; set; }
        public DateOnly StartDate { get; set; }

        public ICollection<CategoryDTO> Categories { get; set; }
        public double? Rate { get; set; }
        public string? Bage { get; set; }
    }
}
