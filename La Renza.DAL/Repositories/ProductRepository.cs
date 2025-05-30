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
            return await db.Product
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.Comments)
                .ToListAsync();
        }

        public async Task<Product> Get(int id)
        {
            Product? product = await db.Product.FindAsync(id);
            return product!;
        }

        public async Task<Product> Get(string color)
        {
            var products = await db.Product
                                   .Where(p => p.Color.Name == color)
                                   .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.Comments)
                                   .ToListAsync();
            Product? product = products?.FirstOrDefault();
            return product!;
        }
        public async Task<Product> GetBySize(string size)
        {
            var products = await db.Product
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.Comments)
                                   .Where(p => p.Size.Name == size)
                                   .ToListAsync();
            Product? product = products?.FirstOrDefault();
            return product!;
        }

        public async Task Create(Product product)
        {
            await db.Product.AddAsync(product);
        }

        public void Update(Product product)
        {
            db.Entry(product).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Product? product = await db.Product.FindAsync(id);
            if (product != null)
                db.Product.Remove(product);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Product.AnyAsync(product => product.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Product.AnyAsync();
        }
    }
}
