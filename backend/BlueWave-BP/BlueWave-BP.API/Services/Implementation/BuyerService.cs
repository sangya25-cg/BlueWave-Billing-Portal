using BlueWave_BP.API.Data;
using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;
using BlueWave_BP.API.Services.Interfaces;

namespace BlueWave_BP.API.Services.Implementation
{
    public class BuyerService : IBuyerService
    {
        private readonly ApplicationDbContext _context;

        public BuyerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateBuyerAsync(CreateBuyerDto buyerDto)
        {
            var buyer = new Buyer
            {
                PartyName = buyerDto.PartyName,
                Gstin = buyerDto.Gstin,
                Mobile = buyerDto.Mobile,
                Email = buyerDto.Email,
                BillingAddress = buyerDto.BillingAddress,
                State = buyerDto.State,
                City = buyerDto.City,

                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.Buyers.AddAsync(buyer);
            await _context.SaveChangesAsync();
        }
    }
}