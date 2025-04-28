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
    internal class ColorService : IColorService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public ColorService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public Task CreateColor(ColorDTO colorDto)
        {

        }
        public Task UpdateColor(ColorDTO colorDto)
        {

        }
        public Task DeleteColor(int id)
        {

        }
        public Task<ColorDTO> GetColor(int id)
        {

        }
        public Task<IEnumerable<ColorDTO>> GetColors()
        {

        }
    }
}
