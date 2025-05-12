using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using La_Renza.BLL.Interfaces;
using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _userService.GetUsers();
            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            UserDTO user = await _userService.GetUser((int)id);

            if (user == null)
            {
                return NotFound();
            }
            return new ObjectResult(user);
        }

        // PUT: api/Users
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _userService.ExistsUser(user.Id))
            {
                return NotFound();
            }

            await _userService.UpdateUser(user);
            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _userService.CreateUser(user);
            return Ok(user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            UserDTO user = await _userService.GetUser((int)id);

            if (user == null)
            {
                return NotFound();
            }

            await _userService.DeleteUser(id);

            return Ok(user);
        }
    }
}
