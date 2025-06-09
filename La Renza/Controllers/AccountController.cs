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
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAddressService _addressService;
        private readonly ICouponService _couponService;
        public AccountController(IUserService userService, IAddressService addressService,ICouponService couponService)
        {
            _userService = userService;
            _addressService = addressService;
            _couponService = couponService;
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


        // POST: api/Account/login
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
        public async Task<IActionResult> ChangeUserPassword([FromBody] ChangePasswordModel model, [FromServices] PasswordHasher hasher)
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
        public async Task<ActionResult> GetUserAddresses()
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
            var addresses = await _addressService.GetAddressesByUserId(user.Id);
            return Ok(addresses);
        }
        [HttpPost("accountAddresses")]
        public async Task<IActionResult> AddUserAddress([FromBody] AccountAddressModel model)
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email)) return Unauthorized();
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
        [HttpPut("accountAddresses/{id}")]
        public async Task<IActionResult> UpdateUserAddress(int id, [FromBody] AccountAddressModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var addresses = await _addressService.GetAddressesByUserId(user.Id);
            var newAddress = addresses.FirstOrDefault(a => a.Id == id);

            if (newAddress == null)
                return NotFound(new { message = "Address not found." });

            newAddress.SecondName = model.SecondName;
            newAddress.FullName = model.FullName;
            newAddress.Street = model.Street;
            newAddress.City = model.City;
            newAddress.HouseNum = model.HouseNum;
            newAddress.PostIndex = model.PostIndex;
            newAddress.AdditionalInfo = model.AdditionalInfo;
            newAddress.PhoneNumber = model.PhoneNumber;

            await _addressService.UpdateAddress(newAddress);

            return Ok(new { message = "Address updated successfully." });
        }
        [HttpGet("accountCoupons")]
        public async Task<ActionResult> GetUserCoupons()
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
            var coupons = await _couponService.GetCouponsByUserId(user.Id);
            return Ok(coupons);
        }
        [HttpPost("accountCoupons")]
        public async Task<IActionResult> AddUserCoupons([FromBody] int couponId)
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var result = await _userService.AddCouponToUser(email, couponId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Купон добавлен и баллы списаны." });
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
        // DELETE: api/Users/deleteAccount
        [HttpDelete("deleteAccount")]
        public async Task<IActionResult> DeleteAccount()
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            await _userService.DeleteUser(user.Id);

            HttpContext.Session.Clear();
            Response.Cookies.Delete("login");

            return Ok(new { message = "Account deleted successfully." });
        }
        // DELETE: api/Users/accountAddresses/5
        [HttpDelete("accountAddresses/{id}")]
        public async Task<IActionResult> DeleteUserAddress(int id)
        {
            string email = GetCurrentUserEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "User not logged in." });

            UserDTO user = await _userService.GetUserByLogin(email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var address = await _addressService.GetAddress(id);
            if (address == null || address.UserId != user.Id)
                return NotFound(new { message = "Address not found or access denied." });

            await _addressService.DeleteAddress(id);

            return Ok(new { message = "Address deleted successfully." });
        }
    }
}
