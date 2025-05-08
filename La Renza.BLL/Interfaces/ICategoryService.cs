using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface ICategoryService
    {
        Task CreateCategory(CategoryDTO categoryDto);
        Task UpdateCategory(CategoryDTO categoryDto);
        Task DeleteCategory(int id);
        Task<CategoryDTO> GetCategory(int id);
        Task<IEnumerable<CategoryDTO>> GetCategories();
    }
}
