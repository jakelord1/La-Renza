using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class SizeOptionRepository : IRepository<SizeOption>
    {
        private LaRenzaContext db;

        public SizeOptionRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<SizeOption>> GetAll()
        {
            return await db.Sizes.ToListAsync();
        }

        public async Task<SizeOption> Get(int id)
        {
            SizeOption? size = await db.Sizes.FindAsync(id);
            return size!;
        }

        public async Task<SizeOption> Get(string name)
        {
            var sizes = await db.Sizes.Where(s => s.Name == name).ToListAsync();
            SizeOption? size = sizes?.FirstOrDefault();
            return size!;
        }

        public async Task Create(SizeOption size)
        {
            await db.Sizes.AddAsync(size);
        }

        public void Update(SizeOption size)
        {
            db.Entry(size).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            SizeOption? size = await db.Sizes.FindAsync(id);
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
