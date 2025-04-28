using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public Task CreateCategory(CategoryDTO categoryDto)
        {

        }
        public Task UpdateCategory(CategoryDTO categoryDto)
        {

        }
        public Task DeleteCategory(int id)
        {

        }
        public Task<CategoryDTO> GetCategory(int id)
        {

        }
        public Task<IEnumerable<CategoryDTO>> GetCategories()
        {

        }
    }
}
