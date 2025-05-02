using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class ColorOptionRepository : IRepository<ColorOption>
    {
        private LaRenzaContext db;

        public ColorOptionRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<ColorOption>> GetAll()
        {
            return await db.Colors
                  .Include(c => c.Model)
                  .Include(c => c.Image)
                  .ToListAsync();
        }

        public async Task<ColorOption> Get(int id)
        {
            var colors = await db.Colors
                .Include(c => c.Model)
                .Include(c => c.Image)
                .Where(a => a.Id == id).ToListAsync();
            ColorOption? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task<ColorOption> Get(string name)
        {         
            var colors = await db.Colors
                .Include(c => c.Model)
                .Include(c => c.Image)
                .Where(a => a.Name == name).ToListAsync();
            ColorOption? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task Create(ColorOption color)
        {
            await db.Colors.AddAsync(color);
        }

        public void Update(ColorOption color)
        {
            db.Entry(color).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            ColorOption? color = await db.Colors.FindAsync(id);
            if (color != null)
                db.Colors.Remove(color);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.Colors.AnyAsync(color => color.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Colors.AnyAsync();
        }

    }
}
