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
    public class AdressesController : ControllerBase
    {
        private readonly IAddressService _addressService;
        public AdressesController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        // GET: api/Addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDTO>>> GetAddresses()
        {
            var adress = await _addressService.GetAddresses();
            return Ok(adress);
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDTO>> GetAddress(int id)
        {
            AddressDTO Address = await _addressService.GetAddress((int)id);

            if (Address == null)
            {
                return NotFound();
            }
            return new ObjectResult(Address);
        }

        // PUT: api/Addresses
        [HttpPut]
        public async Task<IActionResult> PutAddress(AddressDTO address)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _addressService.ExistsAddress(address.Id))
            {
                return NotFound();
            }

            await _addressService.UpdateAddress(address);
            return Ok(address);
        }

        // POST: api/Addresses
        [HttpPost]
        public async Task<ActionResult<AddressDTO>> PostAddress(AddressDTO address)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _addressService.CreateAddress(address);
            return Ok(address);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            AddressDTO Address = await _addressService.GetAddress((int)id);

            if (Address == null)
            {
                return NotFound();
            }

            await _addressService.DeleteAddress(id);

            return Ok(Address);
        }

    }
}
