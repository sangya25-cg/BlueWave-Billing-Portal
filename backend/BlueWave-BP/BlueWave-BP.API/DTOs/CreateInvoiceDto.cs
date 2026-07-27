namespace BlueWave_BP.API.DTOs
{
    public class CreateInvoiceDto
    {
        public int BuyerId { get; set; }

        public decimal GstRate { get; set; } = 5;

        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }
}