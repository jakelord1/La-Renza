﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Entities
{
    public class ShoppingCart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public User User { get; set; }
        public Product Product { get; set; }
    }
}
