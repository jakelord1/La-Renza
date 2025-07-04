﻿using La_Renza.BLL.Entities;

namespace La_Renza.BLL.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<Address> Addresses { get; }
        IRepository<Admin> Admins { get; }
        IRepository<Category> Categories { get; }
        IRepository<Color> Colors { get; }
        IRepository<Comment> Comments { get; }
        IRepository<Coupon> Coupons { get; }
        IRepository<DeliveryMethod> DeliveryMethods { get; }
        IRepository<Image> Images { get; }
        IRepository<InvoiceInfo> Invoices { get; }
        IRepository<Model> Models { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        //IRepository<Product> Products { get; }
        IRepository<Size> Sizes { get; }
        IRepository<User> Users { get; }
        IRepository<ShoppingCart> ShopingCarts { get; }
        IProductRepository Products { get; }
        Task Save();
    }
}
