using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class AdminRepository : IRepository<Admin>
    {
        private LaRenzaContext db;

        public AdminRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Admin>> GetAll()
        {
            return await db.Admins.ToListAsync();
        }

        public async Task<Admin> Get(int id)
        {
            Admin? admin = await db.Admins.FindAsync(id);
            return admin!;
        }

        public async Task<Admin> Get(string email)
        {
            var admins = await db.Admins.Where(a => a.Email == email).ToListAsync();
            Admin? admin = admins?.FirstOrDefault();
            return admin!;
        }

        public async Task Create(Admin admin)
        {
            await db.Admins.AddAsync(admin);
        }

        public void Update(Admin admin)
        {
            db.Entry(admin).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Admin? admin = await db.Admins.FindAsync(id);
            if (admin != null)
                db.Admins.Remove(admin);
        }
    }
}
