using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Mysqlx.Crud;

namespace La_Renza.BLL.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Column("E-mail")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string SurName { get; set; }
        public DateTime BirthDate { get; set; }
        public bool Gender { get; set; }
        public string Password { get; set; }
        public bool NewsOn { get; set; }
        public int LaRenzaPoints { get; set; }

        public ICollection<InvoiceInfo> Invoices { get; set; }
        public ICollection<Coupon>? Cupon { get; set; }

        public ICollection<Address> Addresses { get; set; }
        public ICollection<Order>? Orders { get; set; }

        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Product>? Product { get; set; }
        public ICollection<ShoppingCart>? ShoppingCarts { get; set; }
    }
}
