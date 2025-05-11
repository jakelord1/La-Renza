using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
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
            var comments = await _commentService.GetComments();
            return Ok(comments);
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int id)
        {
            CommentDTO comment = await _commentService.GetComment((int)id);

            if (comment == null)
            {
                return NotFound();
            }
            return new ObjectResult(comment);
        }

        // PUT: api/Comments
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, CommentDTO comment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _commentService.UpdateComment(comment);
            return Ok(comment);
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<CommentDTO>> PostComment(CommentDTO comment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _commentService.CreateComment(comment);
            return Ok(comment);
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            CommentDTO comment = await _commentService.GetComment((int)id);

            if (comment == null)
            {
                return NotFound();
            }

            await _commentService.DeleteComment(id);

            return Ok(comment);
        }

    }
}
