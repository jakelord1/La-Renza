using La_Renza.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.DTO
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public ProductDTO Product { get; set; }
        public int UserId { get; set; }
        public UserDTO User { get; set; }
        public string? ImagePath { get; set; }

        public string Text { get; set; }
        public int? Rating { get; set; }
        public DateTime Date { get; set; }
        public int LikesAmount { get; set; }
    }
}
