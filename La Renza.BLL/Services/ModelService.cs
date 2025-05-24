using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.DTO;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage;

namespace La_Renza.BLL.Services
{
    internal class ModelService : IModelService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public ModelService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task CreateModel(ModelDTO modelDto)
        {
            var model = new Model
            {
                Id = modelDto.Id,
                Name = modelDto.Name,
                Description = modelDto.Description,
                StartDate = modelDto.StartDate,
                MaterialInfo = modelDto.MaterialInfo,
                Rate = modelDto.Rate,
                Bage = modelDto.Bage
            };
            await Database.Models.Create(model);
            await Database.Save();
        }
        public async Task UpdateModel(ModelDTO modelDto)
        {
            
            var model = new Model
            {
                Id = modelDto.Id,
                Name = modelDto.Name,
                Description = modelDto.Description,
                StartDate = modelDto.StartDate,
                MaterialInfo = modelDto.MaterialInfo,
                Rate = modelDto.Rate,
                Bage = modelDto.Bage
            };
            Database.Models.Update(model);
            await Database.Save();

        }
        public async Task DeleteModel(int id)
        {
            await _db.Models.Delete(id);
            await _db.Save();
        }
        public async Task<ModelDTO> GetModel(int id)
        {
            var model = await _db.Models.Get(id);
            return _mapper.Map<ModelDTO>(model);
        }
        public async Task<IEnumerable<ModelDTO>> GetModels()
        {
            var models = await _db.Models.GetAll();
            return _mapper.Map<IEnumerable<ModelDTO>>(models);
        }

        public async Task<bool> ExistsModel(int id)
        {
            return await _db.Models.Exists(id);
        }
    }
}
