using BlueWave_BP.API.Data;
using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using BlueWave_BP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlueWave_BP.API.Services.Implementation
{
    public class BuyerProductPriceService : IBuyerProductPriceService
    {
        private readonly ApplicationDbContext _context;

        public BuyerProductPriceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AssignPriceAsync(AssignBuyerProductPriceDto dto)
        {
            var existingPrice = await _context.BuyerProductPrices
                .FirstOrDefaultAsync(x =>
                    x.BuyerId == dto.BuyerId &&
                    x.ProductId == dto.ProductId);

            if (existingPrice != null)
            {
                existingPrice.Rate = dto.Rate;
                existingPrice.UpdatedAt = DateTime.Now;
            }
            else
            {
                var buyerProductPrice = new BuyerProductPrice
                {
                    BuyerId = dto.BuyerId,
                    ProductId = dto.ProductId,
                    Rate = dto.Rate,

                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                await _context.BuyerProductPrices.AddAsync(buyerProductPrice);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<BuyerProductPriceResponseDto>> GetProductsByBuyerAsync(int buyerId)
        {
            return await _context.BuyerProductPrices
                .Where(x => x.BuyerId == buyerId)
                .Join(
                    _context.Products,
                    bpp => bpp.ProductId,
                    product => product.Id,
                    (bpp, product) => new BuyerProductPriceResponseDto
                    {
                        ProductId = product.Id,
                        ProductName = product.ModelName,
                        Rate = bpp.Rate
                    })
                .ToListAsync();
        }
    }
}