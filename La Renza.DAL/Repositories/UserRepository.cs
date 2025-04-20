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
            return await db.Users.ToListAsync();
        }

        public async Task<User> Get(int id)
        {
            User? user = await db.Users.FindAsync(id);
            return user!;
        }

        public async Task<User> Get(string email)
        {
            var users = await db.Users.Where(u => u.Email == email).ToListAsync(); 
            User? user = users?.FirstOrDefault();
            return user!;
        }

        public async Task Create(User user)
        {
            await db.Users.AddAsync(user);
        }

        public void Update(User user)
        {
            db.Entry(user).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            User? user = await db.Users.FindAsync(id);
            if (user != null)
                db.Users.Remove(user);
        }
    }
}
