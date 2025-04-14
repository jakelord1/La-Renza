using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string FullName { get; set; }
        public string SecondName { get; set; }
        public string City { get; set; }
        public string PostIndex { get; set; }
        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public bool IsDigital { get; set; }

        public User? User { get; set; }
    }
}
