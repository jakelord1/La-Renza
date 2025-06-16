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
    
        // PUT: api/Admins
        [HttpPut]
        public async Task<IActionResult> PutAdmin(AdminDTO admin, [FromServices] PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existAdmin = await _adminService.GetAdmin(admin.Id);
            if (existAdmin == null)
            {
                return NotFound();
            }
            if (!hasher.VerifyPassword(admin.Password, existAdmin.Password))
            {
                admin.Password = hasher.HashPassword(admin.Password);
            }
            else
            {
                admin.Password = existAdmin.Password;
            }

            await _adminService.UpdateAdmin(admin);
            return Ok(admin);
        }

        // POST: api/Admins
        [HttpPost]
        public async Task<ActionResult<AdminDTO>> PostAdmin(AdminDTO admin,[FromServices] PasswordHasher hasher)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            admin.Password = hasher.HashPassword(admin.Password);
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
