using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using La_Renza.BLL.Interfaces;
using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Services;
using La_Renza.BLL.Entities;
using La_Renza.BLL;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAddressService _addressService;
        public UsersController(IUserService userService,IAddressService addressService)
        {
            _userService = userService;
            _addressService = addressService;
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
        [HttpPut]
        public async Task<IActionResult> PutUser(UserDTO user, [FromServices] PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existUser = await _userService.GetUser(user.Id);
            if (existUser == null)
            {
                return NotFound();
            }
            if (!hasher.VerifyPassword(user.Password, existUser.Password))
            {
                user.Password = hasher.HashPassword(user.Password);
            }
            else
            {
                user.Password = existUser.Password;
            }
            await _userService.UpdateUser(user);
            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO user, [FromServices] PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            user.Password = hasher.HashPassword(user.Password);
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
