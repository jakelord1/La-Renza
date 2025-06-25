using System.ComponentModel.DataAnnotations;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Status { get; set; }
        public int DeliveryId { get; set; }
        public int? CuponsId { get; set; }
        public string OrderName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int PaymentMethod { get; set; }
        public int? DeliveryMethodId { get; set; }
        public string Phonenumber { get; set; }

        public ICollection<OrderItemDTO> orderItems { get; set; }
        public UserBase User { get; set; }
        public AddressDTO? Delivery { get; set; }
        public CouponDTO? Cupons { get; set; }
        public DeliveryMethodDTO? DM { get; set; }
    }
 
}
