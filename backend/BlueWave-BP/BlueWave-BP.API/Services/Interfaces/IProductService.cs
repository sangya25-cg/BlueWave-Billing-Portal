using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface IProductService
    {
        Task CreateProductAsync(CreateProductDto productDto);

        Task<List<Product>> GetAllProductsAsync();
    }
}