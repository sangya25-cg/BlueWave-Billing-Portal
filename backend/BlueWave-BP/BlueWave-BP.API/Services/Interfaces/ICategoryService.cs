using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task CreateCategoryAsync(CreateCategoryDto categoryDto);

        Task<List<Category>> GetAllCategoriesAsync();
    }
}