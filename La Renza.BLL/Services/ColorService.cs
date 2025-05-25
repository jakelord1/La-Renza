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
    internal class ColorService : IColorService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public ColorService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task CreateColor(ColorDTO colorDto)
        {
            var photos = _mapper.Map<IEnumerable<ImageDTO>>(colorDto.Photos);
            var color = new Color
            {
                Name = colorDto.Name,
                ModelId = colorDto.ModelId,
                ImageId = colorDto.ImageId,
                Photos = _mapper.Map<ICollection<Image>>(photos)
            };
            await _db.Colors.Create(color);
            await _db.Save();
        }
        public async Task UpdateColor(ColorDTO colorDto)
        {

            var photos = _mapper.Map<IEnumerable<Image>>(colorDto.Photos); 
            var color = new Color
            {
                Id = colorDto.Id,
                Name = colorDto.Name,
                ModelId = colorDto.ModelId,
                ImageId = colorDto.ImageId,
                Photos = _mapper.Map<ICollection<Image>>(photos)
            };
            var Saved = await _db.Colors.Get(colorDto.Id);
            if (Saved != null)
                Saved = color;
            else
                throw new Exception();
            await _db.Save();
        }


        public async Task DeleteColor(int id)
        {
            await _db.Colors.Delete(id);
            await _db.Save();
        }
        public async Task<ColorDTO> GetColor(int id)
        {
            var color = await _db.Colors.Get(id);
            return _mapper.Map<ColorDTO>(color);
        }
        public async Task<IEnumerable<ColorDTO>> GetColors()
        {
            var colors = await _db.Colors.GetAll();
            return _mapper.Map<IEnumerable<ColorDTO>>(colors);
        }

        public async Task<bool> ExistsColor(int id)
        {
            return await _db.Colors.Exists(id);
        }
    }
}
