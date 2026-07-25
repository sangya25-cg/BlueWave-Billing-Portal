using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface IBuyerService
    {
        Task CreateBuyerAsync(CreateBuyerDto buyerDto);
        Task<List<Buyer>> GetAllBuyersAsync();
    }
}
