using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.BLL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceInfosController : ControllerBase
    {
        private readonly IInvoiceInfoService _invoiceInfoService;
        public InvoiceInfosController (IInvoiceInfoService invoiceInfoService)
        {
            _invoiceInfoService = invoiceInfoService;
        }
        // GET: api/InvoiceInfos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceInfoDTO>>> GetInvoiceInfos()
        {
            var invoiceInfos = await _invoiceInfoService.GetInvoiceInfos();
            return Ok(invoiceInfos);
        }

        // GET: api/InvoiceInfos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceInfoDTO>> GetInvoiceInfo(int id)
        {
            InvoiceInfoDTO invoiceInfo = await _invoiceInfoService.GetInvoiceInfo((int)id);

            if (invoiceInfo == null)
            {
                return NotFound();
            }
            return new ObjectResult(invoiceInfo);
        }

        // PUT: api/InvoiceInfos
        [HttpPut]
        public async Task<IActionResult> PutInvoiceInfo(InvoiceInfoDTO invoiceInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _invoiceInfoService.ExistsInvoiceInfo(invoiceInfo.Id))
            {
                return NotFound();
            }

            await _invoiceInfoService.UpdateInvoiceInfo(invoiceInfo);
            return Ok(invoiceInfo);
        }

        // POST: api/InvoiceInfos
        [HttpPost]
        public async Task<ActionResult<InvoiceInfoDTO>> PostInvoiceInfo(InvoiceInfoDTO invoiceInfos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _invoiceInfoService.CreateInvoiceInfo(invoiceInfos);
            return Ok(invoiceInfos);
        }

        // DELETE: api/InvoiceInfos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceInfo(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            InvoiceInfoDTO invoiceInfo = await _invoiceInfoService.GetInvoiceInfo((int)id);

            if (invoiceInfo == null)
            {
                return NotFound();
            }

            await _invoiceInfoService.DeleteInvoiceInfo(id);

            return Ok(invoiceInfo);
        }
    }
}
