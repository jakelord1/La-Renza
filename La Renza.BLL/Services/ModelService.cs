using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;
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
                Name = modelDto.Name,
                Description = modelDto.Description,
                StartDate = modelDto.StartDate,
                MaterialInfo = modelDto.MaterialInfo,
                Id = modelDto.Id,
                Rate = modelDto.Rate,
                Bage = modelDto.Bage
            };

            await _db.Models.Create(model);
            await _db.Save();
        }
        public async Task UpdateModel(ModelDTO modelDto)
        {
            var model = new Model
            {
                Name = modelDto.Name,
                Description = modelDto.Description,
                StartDate = modelDto.StartDate,
                MaterialInfo = modelDto.MaterialInfo,
                Id = modelDto.Id,
                Rate = modelDto.Rate,
                Bage = modelDto.Bage
            };
            var Saved = await _db.Models.Get(modelDto.Id);
            if (Saved != null)
                Saved = model;
            else
                throw new Exception();
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
    }
}
