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
            return await db.Sizes.ToListAsync();
        }

        public async Task<Size> Get(int id)
        {
            Size? size = await db.Sizes.FindAsync(id);
            return size!;
        }

        public async Task<Size> Get(string name)
        {
            var sizes = await db.Sizes.Where(s => s.Name == name).ToListAsync();
            Size? size = sizes?.FirstOrDefault();
            return size!;
        }

        public async Task Create(Size size)
        {
            await db.Sizes.AddAsync(size);
        }

        public void Update(Size size)
        {
            db.Entry(size).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Size? size = await db.Sizes.FindAsync(id);
            if (size != null)
                db.Sizes.Remove(size);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Sizes.AnyAsync(size => size.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Sizes.AnyAsync();
        }
    }
}
