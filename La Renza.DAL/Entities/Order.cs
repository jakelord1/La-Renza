using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL.Entities
{
    public enum Status { Active, InProgress, Ready }
    public class Order
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public Status Status { get; set; }
        public int DeliveryId { get; set; }
        public int? CuponsId { get; set; }
        public string OrderName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int PaymentMethod { get; set; }
        public int DeliveryMethodId { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
        public ICollection<DeliveryMethod>? DeliveryMethods { get; set; }

        public User? User { get; set; }
        public Address? Delivery { get; set; }
        public Coupon? Cupons { get; set; }

    }
}
