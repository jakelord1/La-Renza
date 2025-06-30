using System.ComponentModel.DataAnnotations;
using La_Renza.BLL.Entities;

namespace La_Renza.BLL.DTO
{
    public class AdminDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Identifier { get; set; }
    }
}
