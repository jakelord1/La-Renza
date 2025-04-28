using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    internal interface ICommentService
    {
        Task CreateComment(CommentDTO commentDto);
        Task UpdateComment(CommentDTO commentDto);
        Task DeleteComment(int id);
        Task<CommentDTO> GetComment(int id);
        Task<IEnumerable<CommentDTO>> GetComments();
    }
}
