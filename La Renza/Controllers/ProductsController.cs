using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Mysqlx.Crud;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ISizeService _sizeService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            var products = await _productService.GetProducts();
            return Ok(products);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            ProductDTO product = await _productService.GetProduct((int)id);

            if (product == null)
            {
                return NotFound();
            }
            return new ObjectResult(product);
        }

        // PUT: api/Products/5
        [HttpPut]
        public async Task<IActionResult> PutProduct( ProductDTO product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _productService.ExistsProduct(product.Id))
            {
                return NotFound();
            }

            await _productService.UpdateProduct(product);
            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<ProductDTO>> PostProduct(ProductDTO product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _productService.CreateProduct(product);
            return Ok(product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ProductDTO product = await _productService.GetProduct((int)id);

            if (product == null)
            {
                return NotFound();
            }

            await _productService.DeleteProduct(id);

            return Ok(product);
        }
    }
}
