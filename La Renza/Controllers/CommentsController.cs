using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments()
        {
            return Ok();
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int id)
        {
            return Ok();
        }

        // PUT: api/Comments
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, CommentDTO comment)
        {
            return Ok();
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<CommentDTO>> PostComment(CommentDTO comment)
        {
            return Ok();
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            return Ok();
        }

    }
}
