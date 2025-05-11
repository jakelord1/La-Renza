using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IColorService _colorService;
        private readonly IModelService _modelService;
        public ProductsController(IProductService productService, IColorService colorService, IModelService modelService)
        {
            _productService = productService;
            _colorService = colorService;
            _modelService = modelService;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            return Ok(); 
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            return Ok(); 
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDTO product)
        {
            return Ok(); 
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<ProductDTO>> PostProduct(ProductDTO product)
        {
            return Ok();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            return Ok(); 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////


        // GET: api/Colors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorDTO>>> GetColors()
        {
            return Ok(); 
        }

        // GET: api/Colors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ColorDTO>> GetColor(int id)
        {
            return Ok(); 
        }

        // PUT: api/Colors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColor(int id, ColorDTO color)
        {
            return Ok();
        }

        // POST: api/Colors
        [HttpPost]
        public async Task<ActionResult<ColorDTO>> PostColor(ColorDTO color)
        {
            return Ok();
        }

        // DELETE: api/Colors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            return Ok();
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // GET: api/Models
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModelDTO>>> GetModels()
        {
            return Ok(); 
        }

        // GET: api/Models/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ModelDTO>> GetModel(int id)
        {
            return Ok(); 
        }

        // PUT: api/Models/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutModel(int id, ModelDTO model)
        {
            return Ok();
        }

        // POST: api/Models
        [HttpPost]
        public async Task<ActionResult<ModelDTO>> PostModel(ModelDTO model)
        {
            return Ok();
        }

        // DELETE: api/Models/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModel(int id)
        {
            return Ok(); 
        }
    }
}
