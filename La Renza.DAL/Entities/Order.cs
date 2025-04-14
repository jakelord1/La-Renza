using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? AddressId { get; set; }
        public int? CouponId { get; set; }
        public string Status { get; set; }
        public string OrderName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime CompletedAt { get; set; }
        public int PaymentMethod { get; set; }
        public int DeliveryMethod { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }

        public User? User { get; set; }
        public Address? Address { get; set; }
        public Coupon? Coupon { get; set; }

    }
}
