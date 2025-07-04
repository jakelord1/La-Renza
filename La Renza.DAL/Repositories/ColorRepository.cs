﻿using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.EF;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;


namespace La_Renza.BLL.Repositories
{
    public class ColorRepository : IRepository<Color>
    {
        private LaRenzaContext db;

        public ColorRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Color>> GetAll()
        {
            return await db.Color
                  .Include(c => c.Model)
                   .ThenInclude(m => m.Category)
                  .Include(c => c.Image)
                  .ToListAsync();
        }

        public async Task<Color> Get(int id)
        {
            var colors = await db.Color
                 .Include(c => c.Model)
                     .ThenInclude(m => m.Category)
                .Where(a => a.Id == id).ToListAsync();
            Color? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task<Color> Get(string name)
        {         
            var colors = await db.Color
                .Include(c => c.Model)
                .Where(a => a.Name == name).ToListAsync();
            Color? color = colors?.FirstOrDefault();
            return color!;
        }

        public async Task Create(Color color)
        {
            await db.Color.AddAsync(color);
        }

        public void Update(Color color)
        {
            db.Entry(color).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Color? color = await db.Color.FindAsync(id);
            if (color != null)
                db.Color.Remove(color);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Color.AnyAsync(color => color.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Color.AnyAsync();
        }
    }
}
