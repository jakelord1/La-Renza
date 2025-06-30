using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.EF;

namespace La_Renza.BLL.Repositories
{
    public class ModelRepository : IRepository<Model>
    {
        private readonly LaRenzaContext db;

        public ModelRepository(LaRenzaContext context)
        {
            db = context;
        }

        public async Task<IEnumerable<Model>> GetAll()
        {
            return await db.Model.Include(m => m.Category).Include(m => m.Image).Include(m => m.Colors).ThenInclude(c => c.Image).ToListAsync();
        }

        public async Task<Model> Get(int id)
        {
            Model? model = await db.Model.Where(m => m.Id == id).Include(m => m.Image).Include(m => m.Colors).ThenInclude(c => c.Image).FirstOrDefaultAsync();
            return model!;
        }

        public async Task<Model> Get(string name)
        {
            var models = await db.Model.Include(m => m.Colors).Include(c => c.Image).Where(m => m.Name == name).ToListAsync();
            Model? model = models?.FirstOrDefault();
            return model!;
        }

        public async Task Create(Model model)
        {
            await db.Model.AddAsync(model);
        }

        public void Update(Model model)
        {
            db.Entry(model).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Model? model = await db.Model.FindAsync(id);
            if (model != null)
                db.Model.Remove(model);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Model.AnyAsync(model => model.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Model.AnyAsync();
        }
    }
}
