using AutoMapper;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
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
        public async Task CreateComment(CommentDTO commentDto)
        {
            var comment = new Comment
            {
                Text = commentDto.Text,
                ProductId = commentDto.ProductId,
                UserId = commentDto.UserId,
                Image = _mapper.Map<Image>(commentDto.Image),
                Rating = commentDto.Rating,
                Date = commentDto.Date,
                LikesAmount = commentDto.LikesAmount
            };
            await _db.Comments.Create(comment);
            await _db.Save();
        }
        public async Task UpdateComment(CommentDTO commentDto)
        {
            var comment = new Comment
            {
                Id = commentDto.Id,
                Text = commentDto.Text,
                ProductId = commentDto.ProductId,
                UserId = commentDto.UserId,
                Image = _mapper.Map<Image>(commentDto.Image),
                Rating = commentDto.Rating,
                Date = commentDto.Date,
                LikesAmount = commentDto.LikesAmount
            };
            var Saved = await _db.Comments.Get(commentDto.Id);
            if (Saved != null)
                Saved = comment;
            else
                throw new Exception();
            await _db.Save();
        }
        public async Task DeleteComment(int id)
        {
            await _db.Comments.Delete(id);
            await _db.Save();
        }
        public async Task<CommentDTO> GetComment(int id)
        {
            var comment = await _db.Comments.Get(id);
            return _mapper.Map<CommentDTO>(comment);
        }
        public async Task<IEnumerable<CommentDTO>> GetComments()
        {
            var comments = await _db.Comments.GetAll();
            return _mapper.Map<IEnumerable<CommentDTO>>(comments);
        }
        public async Task<bool> ExistsComment(int id)
        {
            return await _db.Comments.Exists(id);
        }
    }
}
