using BlueWave_BP.API.DTOs;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface IBuyerService
    {
        Task CreateBuyerAsync(CreateBuyerDto buyerDto);
    }
}
