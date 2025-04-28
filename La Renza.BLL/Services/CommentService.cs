using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Services
{
    internal class CommentService : ICommentService
    {
        private readonly IUnitOfWork _db;
        private readonly IMapper _mapper;
        public CommentService(IUnitOfWork db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }
        Task CreateComment(CommentDTO commentDto)
        {

        }
        Task UpdateComment(CommentDTO commentDto)
        {

        }
        Task DeleteComment(int id)
        {

        }
        Task<CommentDTO> GetComment(int id)
        {

        }
        async Task<IEnumerable<CommentDTO>> GetComments()
        {
            var comments = await _db.
        }
    }
}
