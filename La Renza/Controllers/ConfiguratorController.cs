using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    /// <summary>
    /// Контролер для роботи з конфігурацією (JSON CRUD)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ConfiguratorController : ControllerBase
    {
        private readonly IConfiguratorService _service;
        public ConfiguratorController(IConfiguratorService service)
        {
            _service = service;
        }

        // GET: api/Configurator
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConfiguratorItem>>> GetAll()
        {
            var items = await _service.GetAll();
            return Ok(items);
        }

        // GET: api/Configurator/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConfiguratorItem>> Get(int id)
        {
            var item = await _service.Get(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/Configurator
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ConfiguratorItem item)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _service.Create(item);
            return Ok(item);
        }

        // PUT: api/Configurator
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ConfiguratorItem item)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _service.Update(item);
            return Ok(item);
        }

        // DELETE: api/Configurator/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok();
        }
    }
}
