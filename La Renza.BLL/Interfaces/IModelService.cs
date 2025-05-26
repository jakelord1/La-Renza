using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface IModelService
    {
        Task CreateModel(ModelDTO modelDto);
        Task UpdateModel(ModelDTO modelDto);
        Task DeleteModel(int id);
        Task<ModelDTO> GetModel(int id);
        Task<IEnumerable<ModelDTO>> GetModels();
        Task<bool> ExistsModel(int id);
    }
}
