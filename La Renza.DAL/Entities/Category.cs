using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? ParentCategoryId { get; set; }
        public bool IsGlobal { get; set; }
        public bool IsActive { get; set; }
        public Image CategoryImage { get; set; }

        public ICollection<Category>? Children { get; set; } = new List<Category>();
        public ICollection<Model>? Models { get; set; }

    }

}
