using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Services
{
    internal class ImageService : IImageService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public ImageService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        public async Task CreateImage(ImageDTO imageDto)
        {
            var image = new Image
            {
                Path = imageDto.Path
            };
            await _db.Images.Create(image);
            await _db.Save();
        }
        public async Task UpdateImage(ImageDTO imageDto)
        {
            var image = new Image
            {
                Path = imageDto.Path
            };
            var Saved = await _db.Images.Get(imageDto.Id);
            if (Saved != null)
                Saved = image;
            else
                throw new Exception();
            await _db.Save();
        }
        public async Task DeleteImage(int id)
        {
            await _db.Images.Delete(id);
            await _db.Save();
        }
        public async Task<ImageDTO> GetImage(int id)
        {
            var image = await _db.Comments.Get(id);
            return _mapper.Map<ImageDTO>(image);
        }
        public async Task<IEnumerable<ImageDTO>> GetImages()
        {
            var images = await _db.Images.GetAll();
            return _mapper.Map<IEnumerable<ImageDTO>>(images);
        }
    }
}
