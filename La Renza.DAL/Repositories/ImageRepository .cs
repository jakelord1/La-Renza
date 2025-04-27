using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class ImageRepository : IRepository<Image>
    {
        private readonly LaRenzaContext db;

        public ImageRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Image>> GetAll()
        {
            return await db.Images.ToListAsync();
        }

        public async Task<Image> Get(int id)
        {
            Image? image = await db.Images.FindAsync(id);
            return image!;
        }

        public async Task<Image> Get(string path)
        {
            var images = await db.Images.Where(i => i.Path == path).ToListAsync();
            Image? image = images?.FirstOrDefault();
            return image!;
        }

        public async Task Create(Image image)
        {
            await db.Images.AddAsync(image);
        }

        public void Update(Image image)
        {
            db.Entry(image).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Image? image = await db.Images.FindAsync(id);
            if (image != null)
                db.Images.Remove(image);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.Images.AnyAsync(image => image.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Images.AnyAsync();
        }
    }
}
