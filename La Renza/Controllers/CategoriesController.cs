using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
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
            return Ok(); 
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            return Ok();
        }    
        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryDTO category)
        {
            return Ok();
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO category)
        {
            return Ok(); 
        }


        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            return Ok(); 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////

        // GET: api/Sizes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SizeDTO>>> GetSizes()
        {
            return Ok(); 
        }

        // GET: api/Sizes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SizeDTO>> GetSize(int id)
        {
            return Ok(); 
        }

        // PUT: api/Sizes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSize(int id, SizeDTO size)
        {
            return Ok(); 
        }

        // POST: api/Sizes
        [HttpPost]
        public async Task<ActionResult<SizeDTO>> PostSize(SizeDTO size)
        {
            return Ok(); 
        }

        // DELETE: api/Sizes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSize(int id)
        {
            return Ok(); 
        }
    }
}
