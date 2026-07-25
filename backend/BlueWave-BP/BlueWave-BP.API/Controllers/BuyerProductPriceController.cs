using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlueWave_BP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerProductPriceController : ControllerBase
    {
        private readonly IBuyerProductPriceService _buyerProductPriceService;

        public BuyerProductPriceController(
            IBuyerProductPriceService buyerProductPriceService)
        {
            _buyerProductPriceService = buyerProductPriceService;
        }

        [HttpPost]
        public async Task<IActionResult> AssignPrice(
            AssignBuyerProductPriceDto dto)
        {
            await _buyerProductPriceService.AssignPriceAsync(dto);

            return Ok("Price assigned successfully.");
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetProductsByBuyer(int buyerId)
        {
            var products =
                await _buyerProductPriceService
                    .GetProductsByBuyerAsync(buyerId);

            return Ok(products);
        }
    }
}