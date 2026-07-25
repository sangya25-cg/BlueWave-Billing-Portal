using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlueWave_BP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto categoryDto)
        {
            await _categoryService.CreateCategoryAsync(categoryDto);

            return Ok("Category created successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            return Ok(categories);
        }
    }
}