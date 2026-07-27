using BlueWave_BP.API.Data;
using BlueWave_BP.API.DTOs;
using BlueWave_BP.API.Models;
using BlueWave_BP.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlueWave_BP.API.Services.Implementation
{
    public class InvoiceService : IInvoiceService
    {
        private readonly ApplicationDbContext _context;

        public InvoiceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<InvoiceResponseDto> CreateInvoiceAsync(
            CreateInvoiceDto invoiceDto)
        {
            var gstRatePercent = invoiceDto.GstRate <= 0 ? 5m : invoiceDto.GstRate;
            var gstRateDecimal = gstRatePercent / 100m;

            var invoiceCount = await _context.Invoices.CountAsync();

            var invoiceNumber =
                $"INV-{(invoiceCount + 1).ToString("D5")}";
            var invoice = new Invoice
            {
                InvoiceNo = invoiceNumber,
                BuyerId = invoiceDto.BuyerId,
                InvoiceDate = DateTime.Now,

                Subtotal = 0,
                GstAmount = 0,
                TotalAmount = 0,

                Status = "GENERATED",

                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();

            decimal subtotal = 0;
            decimal gstAmount = 0;
            decimal totalAmount = 0;
            foreach (var item in invoiceDto.Items)
            {
                var buyerPrice = await _context.BuyerProductPrices
                    .FirstOrDefaultAsync(x =>
                        x.BuyerId == invoiceDto.BuyerId &&
                        x.ProductId == item.ProductId);

                var product = await _context.Products
                    .FirstOrDefaultAsync(x => x.Id == item.ProductId);

                if (product == null)
                {
                    throw new Exception(
                        $"Product not found for Product Id {item.ProductId}");
                }

                var finalRate = buyerPrice?.Rate ?? product.DefaultPrice;

                var amount = finalRate * item.Qty;

                var gst = amount * gstRateDecimal;

                var total = amount + gst;

                var invoiceItem = new InvoiceItem
                {
                    InvoiceId = invoice.Id,

                    ProductId = item.ProductId,

                    Qty = item.Qty,

                    Rate = finalRate,

                    Amount = amount,

                    GstRate = gstRatePercent,

                    GstAmount = gst,

                    TotalAmount = total,

                    CreatedAt = DateTime.Now,

                    UpdatedAt = DateTime.Now
                };
                await _context.InvoiceItems.AddAsync(invoiceItem);
                subtotal += amount;

                gstAmount += gst;

                totalAmount += total;

            }
            await _context.SaveChangesAsync();
            invoice.Subtotal = subtotal;

            invoice.GstAmount = gstAmount;

            invoice.TotalAmount = totalAmount;

            invoice.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return new InvoiceResponseDto
            {
                InvoiceId = invoice.Id,

                InvoiceNo = invoice.InvoiceNo,

                Subtotal = invoice.Subtotal,

                GstAmount = invoice.GstAmount,

                TotalAmount = invoice.TotalAmount
            };
        }

        public async Task<List<InvoiceListItemDto>> GetAllInvoicesAsync()
        {
            return await _context.Invoices
                .Join(
                    _context.Buyers,
                    invoice => invoice.BuyerId,
                    buyer => buyer.Id,
                    (invoice, buyer) => new InvoiceListItemDto
                    {
                        InvoiceId = invoice.Id,
                        InvoiceNo = invoice.InvoiceNo,
                        BuyerName = buyer.PartyName,
                        InvoiceDate = invoice.InvoiceDate,
                        TotalAmount = invoice.TotalAmount,
                        Status = invoice.Status ?? string.Empty
                    })
                .OrderByDescending(x => x.InvoiceId)
                .ToListAsync();
        }
    }
}