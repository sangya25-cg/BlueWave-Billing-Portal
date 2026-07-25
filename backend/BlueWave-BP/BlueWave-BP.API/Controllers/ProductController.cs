using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlueWave_BP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto productDto)
        {
            await _productService.CreateProductAsync(productDto);

            return Ok("Product created successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productService.GetAllProductsAsync();

            return Ok(products);
        }
    }
}