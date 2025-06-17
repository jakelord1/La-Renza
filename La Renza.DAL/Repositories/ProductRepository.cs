using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;
using System.Drawing;

namespace La_Renza.DAL.Repositories
{
    public class ProductRepository : IProductRepository
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
                .ThenInclude(c => c.Model)
                    .ThenInclude(m => m.Category)
                       .ThenInclude(cat => cat.SizeOptions)
            .Include(p => p.Size)
            .Include(p => p.Comments)
            .Include(p => p.User)
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
                 .Include(p => p.User)
                                   .ToListAsync();
            Product? product = products?.FirstOrDefault();
            return product!;
        }
        public async Task<Product> GetBySize(string size)
        {
            var products = await db.Product
                .Include(p => p.Color)
                 .Include(p => p.User)
                .Include(p => p.Size)
                .Include(p => p.Comments)
                                   .Where(p => p.Size.Name == size)
                                   .ToListAsync();
            Product? product = products?.FirstOrDefault();
            return product!;
        }

        public async Task<IEnumerable<Product>> GetByUserId(int userId)
        {
            return await db.Product
                .Include(p => p.User)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Category)
                            .ThenInclude(cat => cat.SizeOptions)
                .Include(p => p.Size)
                .Where(p => p.User.Any(u => u.Id == userId))
                .ToListAsync();
        }
        public async Task<IEnumerable<Model>> GetModelsByUserId(int userId)
        {
            return await db.Product
                 .Where(p => p.User.Any(u => u.Id == userId)).Select(p => p.Color.Model)
                 .Distinct()
                 .Include(m => m.Colors)
                 .Include(m => m.Image)
                 .ToListAsync();
        }

        public async Task<Model?> GetModelWithSpecificColor(int modelId, int colorId)
        {
            var model = await db.Model
                .Include(m => m.Colors)
                .Include(m => m.Image)
                .FirstOrDefaultAsync(m => m.Id == modelId);

            if (model == null)
                return null;

            model.Colors = model.Colors.Where(c => c.Id == colorId).ToList();

            return model;
        }
        public async Task<IEnumerable<Model>> GetModelsByUserAndColor(int userId, int colorId)
        {
            var products = await db.Product
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Image)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Colors)
                .Where(p => p.User.Any(u => u.Id == userId) && p.Color.Id == colorId)
                .ToListAsync();

            var models = products
                .Select(p => p.Color.Model)
                .Distinct()
                .ToList();

            foreach (var model in models)
            {
                model.Colors = model.Colors.Where(c => c.Id == colorId).ToList();
            }

            return models;
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
