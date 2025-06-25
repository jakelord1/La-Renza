using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class SizeRepository : IRepository<Size>
    {
        private LaRenzaContext db;

        public SizeRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Size>> GetAll()
        {
            return await db.Size.Include(s => s.Category).ThenInclude(s => s.CategoryImage).ToListAsync();
        }

        public async Task<Size> Get(int id)
        {
            Size? size = await db.Size.FindAsync(id);
            return size!;
        }

        public async Task<Size> Get(string name)
        {
            var sizes = await db.Size.Where(s => s.Name == name).ToListAsync();
            Size? size = sizes?.FirstOrDefault();
            return size!;
        }

        public async Task Create(Size size)
        {
            await db.Size.AddAsync(size);
        }

        public void Update(Size size)
        {
            db.Entry(size).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Size? size = await db.Size.FindAsync(id);
            if (size != null)
                db.Size.Remove(size);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Size.AnyAsync(size => size.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Size.AnyAsync();
        }
    }
}
