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
    internal class ProductService : IProductService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public ProductService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public Task CreateProduct(ProductDTO productDto)
        {

        }
        public Task UpdateProduct(ProductDTO productDto)
        {

        }
        public Task DeleteProduct(int id)
        {

        }
        public Task<ProductDTO> GetProduct(int id)
        {

        }
        public Task<IEnumerable<ProductDTO>> GetProducts()
        {

        }
    }
}
