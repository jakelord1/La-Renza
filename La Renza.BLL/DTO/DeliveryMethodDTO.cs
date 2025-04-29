using System.ComponentModel.DataAnnotations;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.DTO
{
    public class DeliveryMethodDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Name { get; set; }
        public double DeliveryPrice { get; set; }
        public string Order { get; set; }
    }
   
}
