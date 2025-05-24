using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZstdSharp.Unsafe;

namespace La_Renza.BLL.Services
{
    internal class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task CreateCategory(CategoryDTO categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                CategoryId = categoryDto.ParentCategoryId,
                IsGlobal = categoryDto.IsGlobal,
                ImageId = categoryDto.ImageId,
                IsActive = true
            };
            await _db.Categories.Create(category);
            await _db.Save();
        }
        public async Task UpdateCategory(CategoryDTO categoryDto)
        {
            var category = new Category
            {
                Id = categoryDto.Id,
                Name = categoryDto.Name,
                CategoryId = categoryDto.ParentCategoryId,
                IsGlobal = categoryDto.IsGlobal,
                ImageId = categoryDto.ImageId,
                IsActive = true
            };

            _db.Categories.Update(category);
            await _db.Save();
        }
        public async Task DeleteCategory(int id)
        {
            await _db.Categories.Delete(id);
            await _db.Save();
        }
        public async Task<CategoryDTO> GetCategory(int id)
        {
            var category = await _db.Categories.Get(id);
            return _mapper.Map<CategoryDTO>(category);
        }
        public async Task<IEnumerable<CategoryDTO>> GetCategories()
        {
            var categories = await _db.Categories.GetAll();
            return _mapper.Map<IEnumerable<CategoryDTO>>(categories);
        }
        public async Task<bool> ExistsCategory(int id)
        {
            return await _db.Categories.Exists(id);
        }
    }
}
