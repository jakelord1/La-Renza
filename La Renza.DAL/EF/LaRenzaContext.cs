using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using La_Renza.DAL.Entities;
using System.Numerics;

namespace La_Renza.DAL.EF
{   
    public class LaRenzaContext : DbContext
    {
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Admin> Admins { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<ColorOption> Colors { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<InvoiceInfo> Invoices { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SizeOption> Sizes { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<ShopingCart> ShopingCarts { get; set; }
        public LaRenzaContext(DbContextOptions<LaRenzaContext> options)
                   : base(options)
        {
            //Database.EnsureCreated();
        }
    }

    //add-migration CreateDb
    //update-database
    public class SampleContextFactory : IDesignTimeDbContextFactory<LaRenzaContext>
    {
        public LaRenzaContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LaRenzaContext>();


            ConfigurationBuilder builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("appsettings.json");
            IConfigurationRoot config = builder.Build();


            string connectionString = config.GetConnectionString("DefaultConnection");
            //optionsBuilder.UseSqlServer(connectionString);
            optionsBuilder.UseMySQL(connectionString);
            return new LaRenzaContext(optionsBuilder.Options);
        }
    }
}
