using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Interfaces
{
    public interface ICommentService
    {
        public Task CreateComment(CommentDTO commentDto);
        public Task UpdateComment(CommentDTO commentDto);
        public Task DeleteComment(int id);
        public Task<CommentDTO> GetComment(int id);
        public Task<IEnumerable<CommentDTO>> GetComments();
    }
}
