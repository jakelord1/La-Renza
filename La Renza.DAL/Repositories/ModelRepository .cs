using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
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
            return await db.Models.ToListAsync();
        }

        public async Task<Model> Get(int id)
        {
            Model? model = await db.Models.FindAsync(id);
            return model!;
        }

        public async Task<Model> Get(string name)
        {
            var models = await db.Models.Where(m => m.Name == name).ToListAsync();
            Model? model = models?.FirstOrDefault();
            return model!;
        }

        public async Task Create(Model model)
        {
            await db.Models.AddAsync(model);
        }

        public void Update(Model model)
        {
            db.Entry(model).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Model? model = await db.Models.FindAsync(id);
            if (model != null)
                db.Models.Remove(model);
        }


        public async Task<bool> Exists(int id)
        {
            return await db.Models.AnyAsync(model => model.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Models.AnyAsync();
        }
    }
}
