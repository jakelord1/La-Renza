using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface IImageService
    {
        //Task CreateImage(ImageDTO imageDto);
        Task<ImageDTO> CreateImage(ImageDTO imageDto);
        Task UpdateImage(ImageDTO imageDto);
        Task DeleteImage(int id);
        Task<ImageDTO> GetImage(int id);
        Task<IEnumerable<ImageDTO>> GetImages();
        Task<bool> ExistsImage(int id);
    }
}
