using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface ISizeService
    {
        Task CreateSize(SizeDTO sizesDto);
        Task UpdateSize(SizeDTO sizeDto);
        Task DeleteSize(int id);
        Task<SizeDTO> GetSize(int id);
        Task<IEnumerable<SizeDTO>> GetSizes();
        Task<int?> GetSizeIdByName(string sizeName);
        Task<bool> ExistsSize(int id);
    }
}
