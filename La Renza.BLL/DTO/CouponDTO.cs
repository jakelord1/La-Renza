using System.ComponentModel.DataAnnotations;
using La_Renza.BLL.Entities;

namespace La_Renza.BLL.DTO
{
    public class CouponDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public ICollection<UserBase>? Users { get; set; }
    }
}
