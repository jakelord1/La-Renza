using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Size
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; }

        public Category Category { get; set; }
    }
}
