using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mysqlx.Crud;

namespace La_Renza.BLL.Entities
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }

        public ICollection<User> User { get; set; }
        public ICollection<Order> Orders { get; set; }

    }
}
