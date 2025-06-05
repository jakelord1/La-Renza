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

        public ICollection<Model> Model { get; set; }
        public ICollection<Category> Category { get; set; }
        public ICollection<Comment> Comment { get; set; }

    }
}
