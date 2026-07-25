using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlueWave_BP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerController : ControllerBase
    {
        private readonly IBuyerService _buyerService;

        public BuyerController(IBuyerService buyerService)
        {
            _buyerService = buyerService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBuyer(CreateBuyerDto buyerDto)
        {
            await _buyerService.CreateBuyerAsync(buyerDto);

            return Ok("Buyer created successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBuyers()
        {
            var buyers = await _buyerService.GetAllBuyersAsync();

            return Ok(buyers);
        }
    }
}