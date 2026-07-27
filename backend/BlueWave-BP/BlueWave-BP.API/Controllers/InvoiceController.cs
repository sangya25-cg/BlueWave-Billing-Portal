using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlueWave_BP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice(
            CreateInvoiceDto invoiceDto)
        {
            var response =
                await _invoiceService.CreateInvoiceAsync(invoiceDto);

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();

            return Ok(invoices);
        }
    }
}