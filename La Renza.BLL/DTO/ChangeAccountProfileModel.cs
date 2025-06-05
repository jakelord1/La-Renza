using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class ChangeAccountProfilveModel
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string SurName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        public DateTime BirthDate { get; set; }

        public bool Gender { get; set; }
    }
}
