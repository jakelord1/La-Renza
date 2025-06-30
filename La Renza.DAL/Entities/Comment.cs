using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int? ImageId { get; set; }
        public Product Product { get; set; }
        public User User { get; set; }
        public Image? Image { get; set; }

        public string Text { get; set; }
        [Range(0, 5)]
        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; }
        public DateTime Date { get; set; }
        public int LikesAmount { get; set; }
    }
}
