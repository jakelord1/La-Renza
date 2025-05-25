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
    public class ModelsController : ControllerBase
    {
        private readonly IModelService _modelService;
        public ModelsController(IModelService modelService)
        {
            _modelService = modelService;
        }
        // GET: api/Models
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelDTO>>> GetModels()
        {
            var models = await _modelService.GetModels();
            return Ok(models);
        }

        // GET: api/Models/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelDTO>> GetModel(int id)
        {
            ModelDTO model = await _modelService.GetModel((int)id);

            if (model == null)
            {
                return NotFound();
            }
            return new ObjectResult(model);
        }

        // PUT: api/Models/5
        [HttpPut]
        public async Task<IActionResult> PutModel(ModelDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _modelService.ExistsModel(model.Id))
            {
                return NotFound();
            }

            await _modelService.UpdateModel(model);
            return Ok(model);
        }

        // POST: api/Models
        [HttpPost]
        public async Task<ActionResult<ModelDTO>> PostModel(ModelDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _modelService.CreateModel(model);
            return Ok(model);
        }

        // DELETE: api/Models/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModel(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ModelDTO model = await _modelService.GetModel((int)id);

            if (model == null)
            {
                return NotFound();
            }

            await _modelService.DeleteModel(id);

            return Ok(model);
        }
    }
}
