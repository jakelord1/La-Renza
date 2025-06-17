using La_Renza.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? ParentCategoryId { get; set; }
        public bool IsGlobal { get; set; }
        public ImageDTO Image { get; set; }
        public List<SizeBase> Sizes { get; set; }
        public List<ModelBase> Models { get; set; }

    }
}
