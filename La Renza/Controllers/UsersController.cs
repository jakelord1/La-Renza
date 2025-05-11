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
        private readonly IAdminService _adminService;
        private readonly IAddressService _addressService;
        private readonly IInvoiceInfoService _invoiceInfoService;

        public UsersController(IUserService userService, IAdminService adminService, IAddressService addressService, IInvoiceInfoService invoiceInfoService)
        {
            _userService = userService;
            _adminService = adminService;
            _addressService = addressService;
            _invoiceInfoService = invoiceInfoService;
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        // GET: api/Admins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDTO>>> GetAdmins()
        {
            return Ok();
        }

        // GET: api/Admins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminDTO>> GetAdmin(int id)
        {

            return Ok();
        }

        // PUT: api/Admins
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdmin(int id, AdminDTO admin)
        {
            return Ok();
        }

        // POST: api/Admins
        [HttpPost]
        public async Task<ActionResult<AdminDTO>> PostAdmin(AdminDTO admin)
        {
            return Ok();
        }

        // DELETE: api/Admins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            return Ok();
        }

        ////////////////////////////////////////////////////////////////////////////////////////

        // GET: api/Addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDTO>>> GetAddresses()
        {
            return Ok();
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDTO>> GetAddress(int id)
        {

            return Ok();
        }

        // PUT: api/Addresses
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddress(int id, AddressDTO address)
        {
            return Ok();
        }

        // POST: api/Addresses
        [HttpPost]
        public async Task<ActionResult<AddressDTO>> PostAddress(AdminDTO address)
        {
            return Ok();
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            return Ok();
        }

        //////////////////////////////////////////////////////////////////////////////////////////////
        // GET: api/InvoiceInfos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceInfoDTO>>> GetInvoiceInfos()
        {
            return Ok();
        }

        // GET: api/InvoiceInfos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceInfoDTO>> GetInvoiceInfo(int id)
        {

            return Ok();
        }

        // PUT: api/InvoiceInfos
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceInfo(int id, InvoiceInfoDTO invoiceInfo)
        {
            return Ok();
        }

        // POST: api/InvoiceInfos
        [HttpPost]
        public async Task<ActionResult<InvoiceInfoDTO>> PostInvoiceInfo(InvoiceInfoDTO invoiceInfos)
        {
            return Ok();
        }

        // DELETE: api/InvoiceInfos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceInfo(int id)
        {
            return Ok();
        }



    }
}
