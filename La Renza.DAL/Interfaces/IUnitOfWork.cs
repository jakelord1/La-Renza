using La_Renza.DAL.Entities;

namespace La_Renza.DAL.Interfaces
{
    public interface IUnitOfWork
    {

        IRepository<Address> Addresses { get; }
        IRepository<Admin> Admins { get; }
        IRepository<Category> Categories { get; }
        IRepository<ColorOption> Colors { get; }
        IRepository<Comment> Comments { get; }
        IRepository<Coupon> Coupons { get; }
        IRepository<Image> Images { get; }
        IRepository<InvoiceInfo> Invoices { get; }
        IRepository<Model> Models { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        IRepository<Product> Products { get; }
        IRepository<SizeOption> Sizes { get; }
        IRepository<User> Users { get; }
        IRepository<ShopingCart> ShopingCarts { get; }
        IRepository<DeliveryMethod> DeliveryMethods { get; }
        
        Task Save();
    }
}
