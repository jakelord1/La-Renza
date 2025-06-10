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

        private async Task<UserDTO?> GetCurrentUser()
        {
            string? userIdStr = HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(userIdStr) && Request.Cookies.ContainsKey("UserId"))
            {
                userIdStr = Request.Cookies["UserId"];
            }

            UserDTO? user = null;

            if (!string.IsNullOrEmpty(userIdStr) && int.TryParse(userIdStr, out int userId))
            {
                user = await _userService.GetUser(userId); 
                if (user != null) return user;
            }

            string? email = HttpContext.Session.GetString("Login");
            if (string.IsNullOrEmpty(email) && Request.Cookies.ContainsKey("login"))
            {
                email = Request.Cookies["login"];
            }

            if (!string.IsNullOrEmpty(email))
            {
                user = await _userService.GetUserByLogin(email);
            }

            return user;
        }

       

        // GET: api/Account/isAuthenticated
        [HttpGet("isAuthenticated")]
        public async Task<ActionResult> IsAuthenticated()
        {
            var user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { isAuthenticated = false });

            return Ok(new { isAuthenticated = true, email = user.Email });
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
                Response.Cookies.Append("UserId", user.Id.ToString(), option);

            }
            HttpContext.Session.SetString("Login", user.Email);
            HttpContext.Session.SetString("UserName", user.FullName);
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            return Ok(new { message = "Login successful" });
        }
        // GET: api/Account/logout
        [HttpGet("logout")]
        public async Task<ActionResult> Logout()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("login");
            return Ok(new { message = "Logout successful" });

        }
        // POST: api/Account/changeUserPassword
        [HttpPost("changeUserPassword")]
        public async Task<IActionResult> ChangeUserPassword([FromBody] ChangePasswordModel model, [FromServices] PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //string? email = HttpContext.Session.GetString("Login");
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            if (!hasher.VerifyPassword(model.CurrentPassword, user.Password))
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }
            user.Password = hasher.HashPassword(model.NewPassword);

            await _userService.UpdateUser(user);

            return Ok(new { message = "Profile updated successfully." });
        }
        // DELETE: api/Users/deleteAccount
        [HttpDelete("deleteAccount")]
        public async Task<IActionResult> DeleteAccount()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            await _userService.DeleteUser(user.Id);

            HttpContext.Session.Clear();
            Response.Cookies.Delete("login");

            return Ok(new { message = "Account deleted successfully." });
        }
        // GET: api/Account/accountProfile
        [HttpGet("accountProfile")]
        public async Task<ActionResult> GetUserInfo()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            return Ok(user);
        }
        // POST: api/Account/changeAccountProfile
        [HttpPost("changeAccountProfile")]
        public async Task<IActionResult> ChangeSomeUser([FromBody] ChangeAccountProfilveModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.FullName = $"{model.FirstName} {model.SurName}";
            user.SurName = model.SurName;
            user.BirthDate = model.BirthDate;
            user.Gender = model.Gender;
            user.Cupons = null;
          

            await _userService.UpdateUser(user);

            return Ok(new { message = "Profile updated successfully." });
        }
       
        // GET: api/Account/accountAddresses
        [HttpGet("accountAddresses")]
        public async Task<ActionResult> GetUserAddresses()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var addresses = await _addressService.GetAddressesByUserId(user.Id);
            return Ok(addresses);
        }
        // POST: api/Account/accountAddresses
        [HttpPost("accountAddresses")]
        public async Task<IActionResult> AddUserAddress([FromBody] AccountAddressModel model)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

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
        // PUT: api/Account/accountAddresses
        [HttpPut("accountAddresses/{id}")]
        public async Task<IActionResult> UpdateUserAddress(int id, [FromBody] AccountAddressModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


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
        // DELETE: api/Users/accountAddresses/5
        [HttpDelete("accountAddresses/{id}")]
        public async Task<IActionResult> DeleteUserAddress(int id)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var address = await _addressService.GetAddress(id);
            if (address == null || address.UserId != user.Id)
                return NotFound(new { message = "Address not found or access denied." });

            await _addressService.DeleteAddress(id);

            return Ok(new { message = "Address deleted successfully." });
        }

        // GET: api/Account/accountCoupons
        [HttpGet("accountCoupons")]
        public async Task<ActionResult> GetUserCoupons()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var coupons = await _couponService.GetCouponsByUserId(user.Id);
            return Ok(coupons);
        }

        // POST: api/Account/accountCoupons
        [HttpPost("accountCoupons")]
        public async Task<IActionResult> AddUserCoupons([FromBody] int couponId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var result = await _userService.AddCouponToUser(user.Email, couponId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Купон добавлен и баллы списаны." });
        }
        // GET: api/Account/accountFavoriteProducts
        [HttpGet("accountFavoriteProducts")]
        public async Task<ActionResult> GetUserFavoriteProducts()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var favoriteProducts = user.FavoriteProducts;
            return Ok(favoriteProducts);
        }
        // POST: api/Account/accountFavoriteProducts
        [HttpPost("accountFavoriteProducts")]
        public async Task<IActionResult> AddFavoriteProduct([FromBody] int productId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var result = await _userService.AddFavoriteProductToUser(user.Email, productId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Product added to favorites successfully." });
        }
        // DELETE: api/Account/accountFavoriteProducts/5
        [HttpDelete("accountFavoriteProducts/{productId}")]
        public async Task<IActionResult> RemoveFavoriteProduct(int productId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var result = await _userService.RemoveFavoriteProductFromUser(user.Email, productId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Product removed from favorites successfully." });
        }

        // GET: api/Account/accountOrders
        [HttpGet("accountOrders")]
        public async Task<ActionResult> GetUserOrders([FromServices] IOrderService orderService)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var orders = await orderService.GetOrdersByUserId(user.Id);
            return Ok(orders);
        }
       
    
    }
}
