using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class CategoryRepository : IRepository<Category>
    {
        private LaRenzaContext db;

        public CategoryRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            return await db.Categories
             .Include(c => c.CategoryImage)
             .ToListAsync();
        }

        public async Task<Category> Get(int id)
        {
            var categories = await db.Categories
             .Include(c => c.CategoryImage)
             .Where(a => a.Id == id).ToListAsync();
            Category? category = categories?.FirstOrDefault();
            return category!;
        }

        public async Task<Category> Get(string name)
        {         
            var categories = await db.Categories
                .Include(c => c.CategoryImage)
                .Where(a => a.Name == name).ToListAsync();
            Category? category = categories?.FirstOrDefault();
            return category!;
        }

        public async Task Create(Category category)
        {
            await db.Categories.AddAsync(category);
        }

        public void Update(Category category)
        {
            db.Entry(category).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Category? category = await db.Categories.FindAsync(id);
            if (category != null)
                db.Categories.Remove(category);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.Categories.AnyAsync(category => category.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Categories.AnyAsync();
        }

    }
}
