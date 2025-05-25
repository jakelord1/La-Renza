using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface IProductService
    {
        Task CreateProduct(ProductDTO productDto);
        Task UpdateProduct(ProductDTO productDto);
        Task DeleteProduct(int id);
        Task<ProductDTO> GetProduct(int id);
        Task<IEnumerable<ProductDTO>> GetProducts();
        Task<bool> ExistsProduct(int id);
    }
}
