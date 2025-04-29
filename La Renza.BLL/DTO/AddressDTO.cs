using System.ComponentModel.DataAnnotations;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.DTO
{
    public class AddressDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string SecondName { get; set; }
        public string FullName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string HouseNum { get; set; }
        public string PostIndex { get; set; }
        public string AdditionalInfo { get; set; }
        public string PhoneNumber { get; set; }
        public string? User { get; set; }

    }
}
