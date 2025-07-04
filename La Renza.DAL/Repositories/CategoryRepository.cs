﻿using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.EF;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;


namespace La_Renza.BLL.Repositories
{
    public class CategoryRepository : IRepository<Category>
    {
        private LaRenzaContext db;

        public CategoryRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            return await db.Category
                .Include(c => c.Models)
                .Include(c => c.CategoryImage)
                .Include(c => c.SizeOptions)
             .ToListAsync();
        }

        public async Task<Category> Get(int id)
        {
            var categories = await db.Category
             .Include(c => c.CategoryImage)
             .Include(c => c.Models)
             .Include(c => c.SizeOptions)
             .Where(a => a.Id == id).ToListAsync();
            Category? category = categories?.FirstOrDefault();
            return category!;
        }

        public async Task<Category> Get(string name)
        {         
            var categories = await db.Category
                .Include(c => c.Models)
                .Include(c => c.CategoryImage)
                .Include(c => c.SizeOptions)
                .Where(a => a.Name == name).ToListAsync();
            Category? category = categories?.FirstOrDefault();
            return category!;
        }

        public async Task Create(Category category)
        {
            await db.Category.AddAsync(category);
        }

        public void Update(Category category)
        {
            db.Entry(category).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Category? category = await db.Category.FindAsync(id);
            if (category != null)
                db.Category.Remove(category);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Category.AnyAsync(categ => categ.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Category.AnyAsync();
        }
    }
}
