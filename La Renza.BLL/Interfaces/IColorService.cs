using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface IColorService
    {
        Task CreateColor(ColorDTO colorDto);
        Task UpdateColor(ColorDTO colorDto);
        Task DeleteColor(int id);
        Task<ColorDTO> GetColor(int id);
        Task<IEnumerable<ColorDTO>> GetColors();
    }
}
