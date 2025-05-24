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
    internal class SizeService : ISizeService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public SizeService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task CreateSize(SizeDTO sizeDto)
        {
            var size = new Size
            {
                Name = sizeDto.Name,
                CategoryId = (int)sizeDto.CategoryId
            };
            await _db.Sizes.Create(size);
            await _db.Save();
        }
        public async Task UpdateSize(SizeDTO sizeDto)
        {
            var size = new Size
            {
                Id = sizeDto.Id,
                Name = sizeDto.Name,
                CategoryId = (int)sizeDto.CategoryId
            };
          
            _db.Sizes.Update(size);
            await _db.Save();
        }
        public async Task DeleteSize(int id)
        {
            await _db.Sizes.Delete(id);
            await _db.Save();
        }
        public async Task<SizeDTO> GetSize(int id)
        {
            var size = await _db.Sizes.Get(id);
            return _mapper.Map<SizeDTO>(size);
        }
        public async Task<IEnumerable<SizeDTO>> GetSizes()
        {
            var size = await _db.Sizes.GetAll();
            return _mapper.Map<IEnumerable<SizeDTO>>(size);
        }
        public async Task<bool> ExistsSize(int id)
        {
            return await _db.Sizes.Exists(id);
        }
    }
}
