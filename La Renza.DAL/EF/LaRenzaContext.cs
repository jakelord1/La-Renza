﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using La_Renza.BLL.Entities;
using System.Numerics;

namespace La_Renza.BLL.EF
{   
    
    public class LaRenzaContext : DbContext
    {
        public DbSet<Address> Address { get; set; }
        public DbSet<Admin> Admins { get; set; }

        public DbSet<Category> Category { get; set; }
        public DbSet<Color> Color { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Coupon> Coupon { get; set; }
        public DbSet<Image> Image { get; set; }
        public DbSet<InvoiceInfo> InvoiceInfo { get; set; }
        public DbSet<Model> Model { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<Size> Size { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<DeliveryMethod> DeliveryMethod { get; set; }
        public DbSet<ShoppingCart> ShoppingCart { get; set; }
        public LaRenzaContext(DbContextOptions<LaRenzaContext> options)
                   : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
