using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Infrastructure;
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
    public class ImageService : IImageService
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
            var savedImage = await _db.Images.Get(imageDto.Id);
            if (savedImage != null)
            {
                savedImage.Path = imageDto.Path;
                await _db.Save();
            }
            else
            {
                throw new Exception("Изображение не найдено.");
            }
        }


        public async Task DeleteImage(int id)
        {
            await _db.Images.Delete(id);
            await _db.Save();
        }



        public async Task<ImageDTO> GetImage(int id)
        {
           
            var image = await _db.Images.Get(id);
            if (image == null)
                throw new ValidationException("Wrong image!", "");

            return _mapper.Map<ImageDTO>(image);
        }
        public async Task<IEnumerable<ImageDTO>> GetImages()
        {
            var images = await _db.Images.GetAll();
            return _mapper.Map<IEnumerable<ImageDTO>>(images);
        }

        public async Task<bool> ExistsImage(int id)
        {
            return await _db.Images.Exists(id);
        }
    }
}
