﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using La_Renza.BLL.Interfaces;
using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.DTO;
using La_Renza.BLL.Services;
using La_Renza.BLL.Entities;
using La_Renza.BLL;
using System.Linq;
using System.Collections.Generic;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAddressService _addressService;
        private readonly ICouponService _couponService;
        private readonly IAccountService _accountService;
        private readonly IAdminService _adminService;
        private readonly IProductService _productService;
        private readonly IOrderService _orderService;
        private readonly IShopingCartService _shopingCartService;
        private readonly ISizeService _sizeService;
        public AccountController(IUserService userService, IAddressService addressService,ICouponService couponService,IAccountService accountService,IAdminService adminService,IProductService productService,IOrderService orderService,IShopingCartService shopingCartService,ISizeService sizeService)
        {
            _userService = userService;
            _addressService = addressService;
            _couponService = couponService;
            _accountService = accountService;
            _adminService = adminService;
            _productService = productService;
            _orderService = orderService;
            _shopingCartService = shopingCartService;
            _sizeService= sizeService;
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
        // GET: api/Account/getRole
        [HttpGet("getRole")]
        public IActionResult GetRole()
        {
            var role = HttpContext.Session.GetString("Role");
            if (string.IsNullOrEmpty(role))
                return Unauthorized(new { message = "Not authenticated" });

            return Ok(new { role });
        }

        // POST: api/Account/loginAdmin
        [HttpPost("loginAdmin")]
        public async Task<ActionResult> LoginAdmin(LoginModel logon, [FromServices] PasswordHasher passwordService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            AdminDTO admin = await _adminService.GetAdminByLogin(logon.Email);

            if (admin == null)
            {
                return NotFound();
            }

            if (!passwordService.VerifyPassword(logon.Password, admin.Password))
            {
                return Unauthorized(new { message = "Invalid login or password" });
            }
            if (logon.RememberMe)
            {
                CookieOptions option = new CookieOptions();
                option.Expires = DateTime.Now.AddDays(10);
                Response.Cookies.Append("loginAdmin", logon.Email, option);
                Response.Cookies.Append("AdminId", admin.Id.ToString(), option);

            }
            HttpContext.Session.SetString("LoginAdmin", admin.Email);
            HttpContext.Session.SetString("AdminIdentifier", admin.Identifier);
            HttpContext.Session.SetString("AdminId", admin.Id.ToString());
            HttpContext.Session.SetString("RoleAdmin", "Admin");
            return Ok(new { message = "Login successful like admin" });
        }

        // POST: api/Account/loginUser
        [HttpPost("loginUser")]
        public async Task<ActionResult> LoginUser(LoginModel logon, [FromServices] PasswordHasher passwordService)
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
                Response.Cookies.Append("loginUser", logon.Email, option);
                Response.Cookies.Append("UserId", user.Id.ToString(), option);

            }
            HttpContext.Session.SetString("LoginUser", user.Email);
            HttpContext.Session.SetString("UserName", user.FullName);
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            HttpContext.Session.SetString("RoleUser", "User");
            return Ok(new { message = "Login successful" });
        }
        // GET: api/Account/logoutUser
        [HttpGet("logoutUser")]
        public async Task<ActionResult> LogoutUser()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("loginUser");
            Response.Cookies.Delete("UserId");
            return Ok(new { message = "Logout successful" });

        }
        // GET: api/Account/logoutAdmin
        [HttpGet("logoutAdmin")]
        public async Task<ActionResult> LogoutAdmin()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("loginAdmin");
            Response.Cookies.Delete("AdminId");
            return Ok(new { message = "Logout successful like admin" });

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
            user.Cupons = null;
            user.FavoriteProducts = null;
            user.Invoices = null;
            user.Addresses = null;


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

            var result = await _accountService.AddCouponToUser(user.Email, couponId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Купон добавлен и баллы списаны." });
        }
        // GET: api/Account/accountFavoriteProducts
        [HttpGet("accountProducts")]
        public async Task<ActionResult> GetUserProducts()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var favoriteProducts = await _productService.GetProductsByUserId(user.Id);
            //var result = favoriteProducts.Select(product => new FavoriteProductDTO
            //{
            //    Id = product.Id, 
            //    Name = product.Color?.Model?.Name ?? "Unknown",
            //    Price = product.Color?.Model?.Price ?? 0,
            //    ImageUrl = product.Color?.Image?.Path ?? "",
            //    Sizes = product.Color ?.Model.Sizes ,
            //    Badges = !string.IsNullOrEmpty(product.Color?.Model?.Bage)
            //? new List<string> { product.Color.Model.Bage! }
            //: new List<string>()
            //}).ToList();

            return Ok(favoriteProducts);
        }
        // GET: api/Account/
        [HttpGet("accountModels")]
        public async Task<ActionResult> GetUserModels()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var favoriteModels = await _productService.GetModelsByUserId(user.Id);

            var result = favoriteModels.Select(model => new ModelProduct
            {
                Id = model.Id,
                Name = model.Name ?? "Unknown",
                Description = model.Description,
                MaterialInfo = model.MaterialInfo,
                StartDate = model.StartDate,
                Price = (decimal)model.Price,
                ImageUrl = model.Photos.FirstOrDefault()?.Path ?? "",
                Rate = model.Rate,
                Sizes = model.Sizes,
                CategoryId = model.CategoryId,
                Bages = !string.IsNullOrEmpty(model.Bage)
       ? new List<string> { model.Bage! }
       : new List<string>()

            }).ToList();
            return Ok(result);
        }

        // GET: api/Account/
        [HttpGet("allModels")]
        public async Task<ActionResult> GetModels()
        {
           
            var models = await _productService.GetModels();
            var result = models.Select(m => new ModelProduct
            {
                Id = m.Id,
                Name = m.Name ?? "Unknown",
                Description = m.Description,
                MaterialInfo = m.MaterialInfo,
                StartDate = m.StartDate,
                Price = (decimal)m.Price,
                Rate = m.Rate,
                ImageUrl = m.Colors.FirstOrDefault()?.Image?.Path ?? "",
                Sizes = m.Sizes ?? new List<string>(),
                Bages = !string.IsNullOrEmpty(m.Bage)
                  ? new List<string> { m.Bage! }
                  : new List<string>(),
                CategoryId = m.CategoryId
            }).ToList();

            return Ok(result);
        }


        // GET: api/Account/
        [HttpGet("accountModelByUserIdAndColor/{colorId}")]
        public async Task<ActionResult> GetModelsByUserIdAndColor(int colorId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var favoriteColorModels = await _productService.GetModelsByUserIdAndColor(user.Id, colorId);
            return Ok(favoriteColorModels);
        }

        // GET: api/Account/
        [HttpGet("accountModelBySpecificColor/{colorId}")]
        public async Task<ActionResult> GetModelBySpecificColor(int colorId)
        {
            var colorModel = await _productService.GetModelBySpecificColor(colorId);

            return Ok(colorModel);
        }
        // POST: api/Account/accountModels/5
        [HttpPost("accountModels/{modelId}")]
        public async Task<IActionResult> AddUserProductsByModel(int modelId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var result = await _accountService.AddFavoriteProductsByModelIdToUser(user.Email, modelId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Products of this model added to favorites successfully." });
        }

        //POST: api/Account/accountProducts
        [HttpPost("accountProducts")]
        public async Task<IActionResult> AddUserProduct([FromBody] int productId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var result = await _accountService.AddFavoriteProductToUser(user.Email, productId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Product added to favorites successfully." });
        }
        //DELETE: api/Account/accountProducts/5
        [HttpDelete("accountProducts/{modelId}")]
        public async Task<IActionResult> RemoveUserProduct(int productId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var result = await _accountService.RemoveFavoriteProductFromUser(user.Email, productId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Product removed from favorites successfully." });
        }
        // DELETE: api/Account/accountModels/5
        [HttpDelete("accountModels/{modelId}")]
        public async Task<IActionResult> RemoveUserProductsByModel(int modelId)
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var result = await _accountService.RemoveFavoriteProductsByModelId(user.Email, modelId);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "All products of this model removed from favorites." });
        }


        // GET: api/Account/accountOrders
        [HttpGet("accountOrders")]
        public async Task<ActionResult> GetUserOrders()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var orders = await _orderService.GetOrdersByUserId(user.Id);
            return Ok(orders);
        }
        // POST: api/Account/addOrder
        [HttpPost("addOrder")]
        public async Task<IActionResult> AddUserOrder([FromBody] OrderDTO orderDto)
        {
            var user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not authenticated." });

            var result = await _accountService.AddOrderToUser(user.Email, orderDto);

            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Order successfully added." });
        }


        // GET: api/Account/accountShoppingCarts
        [HttpGet("accountShoppingCarts")]
        public async Task<ActionResult> GetUserShoppingCarts()
        {
            UserDTO? user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });


            var shoppingCarts = await _shopingCartService.GetShoppingCartsByUserId(user.Id);
            return Ok(shoppingCarts);
        }
        // POST: api/Account/addToCartByModel
        [HttpPost("addToCartByColor")]
        public async Task<IActionResult> AddToCartByModel([FromBody] AddCartByColor dto)
        {
            var user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });
            SizeDTO? sizeId = await _sizeService.GetSize(dto.SizeId);
            if (sizeId == null)
                return BadRequest(new { message = $"Розмір '{dto.SizeId}' не знайдений." });


            var result = await _accountService.AddProductToCartByColorAndSize(user.Email, dto.ColorId, dto.SizeId, dto.Quantity);
            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = "Product added to cart." });
        }

        [HttpDelete("removeFromCartByProduct/{productId}")]
        public async Task<IActionResult> RemoveFromCartByProduct(int productId)
        {
            var user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { message = "User not logged in." });

            var result = await _accountService.RemoveFromCartByUserAndProduct(user.Id, productId);
            if (!result.Success)
                return NotFound(new { message = result.ErrorMessage });

            return Ok(new { message = "Item removed from cart." });
        }

    }
}
