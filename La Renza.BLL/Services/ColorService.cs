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
            var color = new Color
            {
                Name = colorDto.Name,
                ModelId = colorDto.ModelId,
                ImageId = colorDto.ImageId,
                Image = _mapper.Map<Image>(colorDto.Image),
                Model = await _db.Models.Get(colorDto.ModelId)
            };
            await _db.Colors.Create(color);
            List<Size> sizes = (await _db.Sizes.GetAll()).Where(s => s.CategoryId == color.Model.CategoryId).ToList();
            foreach (Size size in sizes)
            {
                Product product = new Product
                {
                    ColorId = color.Model.CategoryId,
                    SizeId = size.Id,
                    Quantity = 0,
                    Color = color,
                    Size = size
                };
                await _db.Products.Create(product);
            }
            await _db.Save();
        }
        public async Task UpdateColor(ColorDTO colorDto)
        {
            var existingColor = await _db.Colors.Get(colorDto.Id);
            if (existingColor == null)
                throw new Exception("Color not found");

            existingColor.Name = colorDto.Name;
            existingColor.ModelId = colorDto.ModelId;
            existingColor.ImageId = colorDto.ImageId;
            existingColor.Model = await _db.Models.Get(colorDto.ModelId);

            _db.Colors.Update(existingColor); 
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
