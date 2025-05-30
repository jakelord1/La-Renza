using La_Renza.BLL;
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
    public class AdminsController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly PasswordHasher Hash;
        public AdminsController (IAdminService adminService)
        {
            _adminService = adminService;
        }
        // GET: api/Admins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDTO>>> GetAdmins()
        {
            var admins = await _adminService.GetAdmins();
            return Ok(admins);
        }

        // GET: api/Admins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminDTO>> GetAdmin(int id)
        {
            AdminDTO admin = await _adminService.GetAdmin(id);

            if (admin == null)
            {
                return NotFound();
            }
            return new ObjectResult(admin);
        }
        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginModel logon, [FromServices] PasswordHasher passwordService)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            AdminDTO user = await _adminService.GetAdminByLogin(logon.Email);
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
                Response.Cookies.Append("login", logon.Email, option);
            }
            HttpContext.Session.SetString("Login", user.Email);
            return Ok();
        }
        // PUT: api/Admins
        [HttpPut]
        public async Task<IActionResult> PutAdmin(AdminDTO admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _adminService.ExistsAdmin(admin.Id))
            {
                return NotFound();
            }

            await _adminService.UpdateAdmin(admin);
            return Ok(admin);
        }

        // POST: api/Admins
        [HttpPost]
        public async Task<ActionResult<AdminDTO>> PostAdmin(AdminDTO admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _adminService.CreateAdmin(admin);
            return Ok(admin);
        }

        // DELETE: api/Admins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            AdminDTO admin = await _adminService.GetAdmin((int)id);

            if (admin == null)
            {
                return NotFound();
            }

            await _adminService.DeleteAdmin(id);

            return Ok(admin);
        }
    }
}
