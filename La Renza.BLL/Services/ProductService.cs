using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;
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
        public async Task CreateProduct(ProductDTO productDto)
        {
            var product = new Product
            {
                ColorId = productDto.ColorId,
                SizeId = productDto.SizeId,
                Quantity = productDto.Quantity,
                User = new List<User>()
            };
            await _db.Products.Create(product);
            await _db.Save();
        }
        public async Task UpdateProduct(ProductDTO productDto)
        {
            Product orig = await _db.Products.Get(productDto.Id);
            var product = new Product
            {
                Id = productDto.Id,
                ColorId = productDto.ColorId,
                SizeId = productDto.SizeId,
                Quantity = productDto.Quantity,
                User = orig.User
            };
            _db.Products.Update(product);
            await _db.Save();

        }
        public async Task DeleteProduct(int id)
        {
            await _db.Products.Delete(id);
            await _db.Save();
        }
        public async Task<ProductDTO> GetProduct(int id)
        {
            var products = await _db.Products.Get(id);
            return _mapper.Map<ProductDTO>(products);
        }
        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            var products = await _db.Products.GetAll();
            return _mapper.Map<IEnumerable<ProductDTO>>(products);
        }

        public async Task<bool> ExistsProduct(int id)
        {
            return await _db.Products.Exists(id);
        }
    }
}
