using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Mysqlx.Crud;

namespace La_Renza.DAL.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string SurName { get; set; }
        public DateTime BirthDate { get; set; }
        public bool Gender { get; set; }
        public string Password { get; set; }
        public bool NewsOn { get; set; }
        public int LaRenzaPoints { get; set; }

        public ICollection<InvoiceInfo>? Invoices { get; set; }
        public ICollection<Coupon>? Coupons { get; set; }

        public ICollection<Address>? Addresses { get; set; }
        public ICollection<Order>? Orders { get; set; }

        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Model>? Favorites { get; set; }
    }
}
