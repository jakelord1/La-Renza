using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class ColorOptionRepository : IRepository<Color>
    {
        private LaRenzaContext db;

        public ColorOptionRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Color>> GetAll()
        {
            return await db.Colors
                  .Include(c => c.Model)
                  .Include(c => c.Image)
                  .ToListAsync();
        }

        public async Task<Color> Get(int id)
        {
            var colors = await db.Colors
                .Include(c => c.Model)
                .Include(c => c.Image)
                .Where(a => a.Id == id).ToListAsync();
            Color? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task<Color> Get(string name)
        {         
            var colors = await db.Colors
                .Include(c => c.Model)
                .Include(c => c.Image)
                .Where(a => a.Name == name).ToListAsync();
            Color? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task Create(Color color)
        {
            await db.Colors.AddAsync(color);
        }

        public void Update(Color color)
        {
            db.Entry(color).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Color? color = await db.Colors.FindAsync(id);
            if (color != null)
                db.Colors.Remove(color);
        }

    }
}
