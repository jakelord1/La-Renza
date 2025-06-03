using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using La_Renza.BLL.Interfaces;
using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
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
        private string GetCurrentUserEmail()
        {
            string? email = HttpContext.Session.GetString("Login");

            if (string.IsNullOrEmpty(email) && Request.Cookies.ContainsKey("login"))
            {
                email = Request.Cookies["login"];
            }

            return email;
        }
        [HttpGet("isAuthenticated")]
        public async Task<ActionResult> IsAuthenticated()
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { isAuthenticated = false });

            return Ok(new { isAuthenticated = true, email });
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
            if (!await _userService.ExistsUser(user.Id))
            {
                return NotFound();
            }
            user.Password = hasher.HashPassword(user.Password);
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

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginModel logon, [FromServices] PasswordHasher passwordService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            UserDTO user = await _userService.GetUserByLogin(logon.Email);
      
            if (user == null)
            {
                return NotFound();
            }
            if (!passwordService.VerifyPassword(logon.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid login or password" });
            }
            if (logon.RememberMe)
            {
                CookieOptions option = new CookieOptions();
                option.Expires = DateTime.Now.AddDays(10);
                Response.Cookies.Append("login", logon.Email, option);

            }
            HttpContext.Session.SetString("Login", user.Email);
            HttpContext.Session.SetString("UserName", user.FullName);
            return Ok(new { message = "Login successful" });
        }

        [HttpGet("logout")]
        public async Task<ActionResult> Logout()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("login");
            return Ok(new { message = "Logout successful" });

        }

        [HttpPost("changeUserPassword")]
        public async Task<IActionResult> ChangeUserPassword([FromBody] ChangePasswordModel model, [FromServices]PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //string? email = HttpContext.Session.GetString("Login");
            string email = GetCurrentUserEmail();
            if (email == null)
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
            {
                return NotFound();
            }
            if (!hasher.VerifyPassword(model.CurrentPassword, user.Password))
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }
            user.Password = hasher.HashPassword(model.NewPassword);

            await _userService.UpdateUser(user);

            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpPost("changeAccountProfile")]
        public async Task<IActionResult> ChangeSomeUser([FromBody] ChangeAccountProfilveModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //string? email = HttpContext.Session.GetString("Login");
            string email = GetCurrentUserEmail();
            if (email == null)
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
            {
                return NotFound();
            }

            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.FullName = $"{model.FirstName} {model.SurName}";
            user.SurName = model.SurName;
            user.BirthDate = model.BirthDate;
            user.Gender = model.Gender;

            await _userService.UpdateUser(user);

            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpGet("accountProfile")]
        public async Task<ActionResult> GetUserInfo()
        {
            //string email = HttpContext.Session.GetString("Login");
            string email = GetCurrentUserEmail();
            if (email == null)
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("accountAddresses")]
        public async Task<ActionResult> GetUserAddresses([FromServices] IAddressService addressService)
        {
            //string email = HttpContext.Session.GetString("Login");
            string? email = GetCurrentUserEmail();
            if (email == null)
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
            {
                return NotFound();
            }
            var addresses = await addressService.GetAddressesByUserId(user.Id);
            return Ok(addresses);
        }
        [HttpPost("accountAddresses")]
        public async Task<IActionResult> AddUserAddress([FromBody] AccountAddressModel model)
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email))  return Unauthorized();
            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var addressDto = new AddressDTO
            {
                UserId = user.Id,
                SecondName = model.SecondName,
                FullName = model.FullName,
                Street = model.Street,
                City = model.City,
                HouseNum = model.HouseNum,
                PostIndex = model.PostIndex,
                AdditionalInfo = model.AdditionalInfo,
                PhoneNumber = model.PhoneNumber
            };
            await _addressService.CreateAddress(addressDto);
            return Ok();
        }


        [HttpGet("accountOrders")]
        public async Task<ActionResult> GetUserOrders([FromServices] IOrderService orderService)
        {
            //string email = HttpContext.Session.GetString("Login");
            string? email = GetCurrentUserEmail();
            if (email == null)
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
            {
                return NotFound();
            }

            var orders = await orderService.GetOrdersByUserId(user.Id);
            return Ok(orders);
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
