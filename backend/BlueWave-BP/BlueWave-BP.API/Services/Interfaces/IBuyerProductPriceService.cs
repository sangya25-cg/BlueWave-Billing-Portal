using BlueWave_BP.API.DTOs;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface IBuyerProductPriceService
    {
        Task AssignPriceAsync(AssignBuyerProductPriceDto dto);

        Task<List<BuyerProductPriceResponseDto>> GetProductsByBuyerAsync(int buyerId);
    }
}