using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class CommentImage
    {
        public int Id { get; set; }
        public int? CommentId { get; set; }
        public string Path { get; set; }
        public Comment? Comment { get; set; }
    }
}
