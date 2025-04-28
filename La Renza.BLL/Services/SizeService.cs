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
    internal class SizeService : ISizeService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public SizeService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public Task CreateSize(SizeDTO sizesDto)
        {

        }
        public Task UpdateSize(SizeDTO sizeDto)
        {

        }
        public Task DeleteSize(int id)
        {

        }
        public Task<SizeDTO> GetSize(int id)
        {

        }
        public Task<IEnumerable<SizeDTO>> GetSizes()
        {

        }
    }
}
