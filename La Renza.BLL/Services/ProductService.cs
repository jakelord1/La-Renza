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
using System.Drawing;

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
           
            var product = new Product
            {
                Id = productDto.Id,
                ColorId = productDto.ColorId,
                SizeId = productDto.SizeId,
                Quantity = productDto.Quantity,
                User = _mapper.Map<ICollection<User>>(productDto.UsersLikesId)
            };
            _db.Products.Update(product);
            await _db.Save();

        }
        public async Task DeleteProduct(int id)
        {
            await _db.Products.Delete(id);
            await _db.Save();
        }
    
        public async Task<ModelDTO?> GetModelBySpecificColor(int modelId, int colorId)
        {
            var model = await _db.Products.GetModelWithSpecificColor(modelId, colorId);
            if (model == null)
                return null;

            return _mapper.Map<ModelDTO>(model);
        }
        public async Task<ProductDTO> GetProduct(int id)
        {
            var products = await _db.Products.Get(id);
            return _mapper.Map<ProductDTO>(products);
        }
        public async Task<IEnumerable<ProductDTO>> GetProductsByUserId(int userId)
        {
            var products = await _db.Products.GetByUserId(userId);
            return _mapper.Map<IEnumerable<ProductDTO>>(products);
        }


        public async Task<IEnumerable<ModelDTO>> GetModelsByUserId(int userId)
        {
            var models = await _db.Products.GetModelsByUserId(userId);
            return _mapper.Map<IEnumerable<ModelDTO>>(models);
        }

        public async Task<IEnumerable<ModelDTO>> GetModelsByUserIdAndColor(int userId, int colorId)
        {
            var models = await _db.Products.GetModelsByUserAndColor(userId, colorId);
            return _mapper.Map<IEnumerable<ModelDTO>>(models);
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
