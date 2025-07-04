﻿using System.ComponentModel.DataAnnotations;
using La_Renza.BLL.Entities;

namespace La_Renza.BLL.DTO
{
    public class UserDTO
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

        public ICollection<AddressDTO>? Addresses { get; set; }
        public ICollection<InvoiceInfoDTO>? Invoices { get; set; }
        public ICollection<CouponDTO>? Cupons { get; set; }
        public ICollection<ProductDTO>? FavoriteProducts { get; set; }
        public ICollection<ShopingCartDTO>? ShoppingCarts { get; set; }
    }

}
