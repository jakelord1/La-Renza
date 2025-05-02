using System.ComponentModel.DataAnnotations;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Status { get; set; }
        public int? AddressId { get; set; }
        public int? CouponId { get; set; }
        public string OrderName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int PaymentMethod { get; set; }
        public int DeliveryMethodId { get; set; }
        public string? User { get; set; }
        public string? Address { get; set; }
        public string? Coupon { get; set; }
    }
 
}
