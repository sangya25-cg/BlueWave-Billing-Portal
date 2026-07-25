using BlueWave_BP.API.DTOs;

namespace BlueWave_BP.API.Services.Interfaces
{
    public interface IInvoiceService
    {
        Task<InvoiceResponseDto> CreateInvoiceAsync(CreateInvoiceDto invoiceDto);
    }
}