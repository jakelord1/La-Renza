using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using La_Renza.BLL.Interfaces


using AutoMapper;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.DTO;

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
        public Task CreateModel(ModelDTO modelDto)
        {

        }
        public Task UpdateModel(ModelDTO modelDto)
        {

        }
        public Task DeleteModel(int id)
        {

        }
        public Task<ModelDTO> GetModel(int id)
        {

        }
        public Task<IEnumerable<ModelDTO>> GetModels()
        {

        }
    }
}
