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
            Product? product = await db.Product.Include(p => p.Color).Include(p => p.Size).Where(p => p.Id == id).FirstOrDefaultAsync();
            return product!;
        }

        public async Task<Product> Get(string color)
        {
            var products = await db.Product
                                   .Where(p => p.Color.Name == color)
                                   .Include(p => p.Color)
                                   .Include(p => p.Color.Model)
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
        public async Task<IEnumerable<Product>> GetByModelId(int modelId)
        {
            return await db.Product
                .Include(p => p.Color)
                .Where(p => p.Color.ModelId == modelId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Product>> GetFavoritesByModelId(int modelId, int userId)
        {
            return await db.Product
                .Include(p => p.Color)
                .Where(p => p.Color.ModelId == modelId && p.User.Any(u => u.Id == userId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetModelsByUserId(int userId)
        {
            return await db.Product
                .Where(p => p.User.Any(u => u.Id == userId))  
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Colors)
                            .ThenInclude(c => c.Image)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Category)
                            .ThenInclude(cat => cat.SizeOptions)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Image)
                .Select(p => p.Color.Model)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetAllModels()
        {
            return await db.Product
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Colors)
                            .ThenInclude(c => c.Image)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Category)
                            .ThenInclude(cat => cat.SizeOptions)
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Image)
                .Select(p => p.Color.Model)
                .Distinct()
                .ToListAsync();
        }




        public async Task<Model?> GetModelWithSpecificColor(int colorId)
        {
            var color = await db.Color
                .Include(c => c.Model)
                    .ThenInclude(m => m.Colors)
                .Include(c => c.Image)
                .FirstOrDefaultAsync(c => c.Id == colorId);

            if (color == null || color.Model == null)
                return null;

            color.Model.Colors = color.Model.Colors.Where(c => c.Id == colorId).ToList();

            return color.Model;
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
                .Include(p => p.Color)
                    .ThenInclude(c => c.Model)
                        .ThenInclude(m => m.Category)
                            .ThenInclude(cat => cat.SizeOptions)
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


        public async Task<IEnumerable<Product>> GetUnfavoritedProductsByModelId(int modelId, int userId)
        {
            var userFavoriteProductIds = await db.User
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Product.Select(p => p.Id))
                .ToListAsync();

            return await db.Product
                .Include(p => p.Color)
                .Where(p => p.Color.ModelId == modelId && !userFavoriteProductIds.Contains(p.Id))
                .ToListAsync();
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
