using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ISizeService _sizeService;
   
        public CategoriesController(ICategoryService categoryService, ISizeService sizeService)
        {
            _categoryService = categoryService;
            _sizeService = sizeService;
          
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categories = await _categoryService.GetCategories();
            return Ok(categories); 
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            CategoryDTO category = await _categoryService.GetCategory((int)id);

            if (category == null)
            {
                return NotFound();
            }
            return new ObjectResult(category);
        }    
        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _categoryService.UpdateCategory(category);
            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _categoryService.CreateCategory(category);
            return Ok(category);
        }


        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            CategoryDTO category = await _categoryService.GetCategory((int)id);

            if (category == null)
            {
                return NotFound();
            }

            await _categoryService.DeleteCategory(id);

            return Ok(category);
        }
    }
}
