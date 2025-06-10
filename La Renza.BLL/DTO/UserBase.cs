using System.ComponentModel.DataAnnotations;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.DTO
{
    public class UserBase
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
    }

}
