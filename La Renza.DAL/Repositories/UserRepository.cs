using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private LaRenzaContext db;

        public UserRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await db.User
                .Include(u => u.Addresses)
                .Include(u => u.Invoices)
                .Include(u => u.Cupon)
                .Include(u=> u.Product)
                .ToListAsync();
        }

        public async Task<User> Get(int id)
        {
            return await db.User
                .Include(u => u.Addresses)
                .Include(u => u.Invoices)
                .Include(u => u.Cupon)
                .Include(u => u.Product)
                    .ThenInclude(p => p.Color)
                       .ThenInclude(c => c.Model)
                 .Include(u => u.Product)
                   .ThenInclude(p => p.Color)
                      .ThenInclude(c => c.Image)
                .Include(u => u.Product)
                    .ThenInclude(p => p.Size)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> Get(string email)
        {
            var users = await db.User
                .Include(u => u.Addresses)
                .Include(u => u.Invoices)
                .Include(u => u.Cupon)
                .Include(u => u.Product)
                .Where(u => u.Email == email).ToListAsync(); 
            User? user = users?.FirstOrDefault();
            return user!;
        }

        public async Task Create(User user)
        {
            await db.User.AddAsync(user);
        }

        public void Update(User user)
        {
            db.Entry(user).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            User? user = await db.User.FindAsync(id);
            if (user != null)
                db.User.Remove(user);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.User.AnyAsync(user => user.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.User.AnyAsync();
        }

    }
}
