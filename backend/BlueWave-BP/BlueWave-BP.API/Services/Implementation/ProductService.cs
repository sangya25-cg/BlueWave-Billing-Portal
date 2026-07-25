using BlueWave_BP.API.Data;
using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlueWave_BP.API.Services.Implementation
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateProductAsync(CreateProductDto productDto)
        {
            var product = new Product
            {
                CategoryId = productDto.CategoryId,
                ModelName = productDto.ModelName,
                DefaultPrice = productDto.DefaultPrice,

                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }
    }
}