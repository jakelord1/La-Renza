using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Model
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? MaterialInfo { get; set; }
        public DateTime StartDate { get; set; }
        public float? Rate { get; set; }
        public string? Bage { get; set; }
        public float Price { get; set; }

        public int CategoryId { get; set; }
        public ICollection<Color>? Colors { get; set; }
        public ICollection<Image>? Image { get; set; }
        public Category Category { get; set; }
    }
}
