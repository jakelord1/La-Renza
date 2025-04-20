using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;
using System.Drawing;

namespace La_Renza.DAL.Repositories
{
    public class ProductRepository : IRepository<Product>
    {
        private LaRenzaContext db;

        public ProductRepository(LaRenzaContext context)
        {
            this.db = context;
        }


        public async Task<IEnumerable<Product>> GetAll()
        {
            return await db.Products.ToListAsync();
        }

        public async Task<Product> Get(int id)
        {
            Product? product = await db.Products.FindAsync(id);
            return product!;
        }

        public async Task<Product> Get(string color)
        {
            var products = await db.Products
                                   .Where(p => p.ColorOption.Name == color)
                                   .ToListAsync();
            Product? product = products?.FirstOrDefault();
            return product!;
        }


        public async Task Create(Product product)
        {
            await db.Products.AddAsync(product);
        }

        public void Update(Product product)
        {
            db.Entry(product).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Product? product = await db.Products.FindAsync(id);
            if (product != null)
                db.Products.Remove(product);
        }
    }
}
