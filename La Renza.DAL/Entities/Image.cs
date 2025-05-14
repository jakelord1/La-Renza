using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Image
    {
        public int Id { get; set; }
        public string Path { get; set; }
        public ICollection<Color> Colors { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<Comment> Comments { get; set; }

    }
}
