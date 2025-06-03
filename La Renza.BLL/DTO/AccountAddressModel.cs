using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class AccountAddressModel
    {
        [Required]
        public string SecondName { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string HouseNum { get; set; }

        [Required]
        [StringLength(10)]
        public string PostIndex { get; set; }

        public string AdditionalInfo { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}
