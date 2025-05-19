using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class CommentRepository : IRepository<Comment>
    {
        private LaRenzaContext db;

        public CommentRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Comment>> GetAll()
        {
            return await db.Comment
                  .Include(c => c.Product)
                  .Include(c => c.User)
                  .Include(c => c.Image)
                  .ToListAsync();
        }

        public async Task<Comment> Get(int id)
        {
            var comments = await db.Comment
                .Include(c => c.User)
                .Include(c => c.Product)
                .Include(c => c.Image)
                .Where(a => a.Id == id).ToListAsync();
            Comment? comment = comments?.FirstOrDefault();
            return comment!;
        }

        public async Task<Comment> Get(string email)
        {
            var comments = await db.Comment
                .Include(c => c.User)
                .Include(c => c.Product)
                .Include(c => c.Image)
                .Where(c => c.User.Email == email)
                .ToListAsync();

            Comment? comment = comments.FirstOrDefault();
            return comment!;
        }


        public async Task Create(Comment comment)
        {
            await db.Comment.AddAsync(comment);
        }

        public void Update(Comment comment)
        {
            db.Entry(comment).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Comment? comment = await db.Comment.FindAsync(id);
            if (comment != null)
                db.Comment.Remove(comment);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.Comment.AnyAsync(comment => comment.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Comment.AnyAsync();
        }
    }
}
