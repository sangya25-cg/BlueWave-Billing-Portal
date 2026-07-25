namespace BlueWave_BP.API.DTOs
{
    public class CreateInvoiceDto
    {
        public int BuyerId { get; set; }

        public List<CreateInvoiceItemDto> Items { get; set; } = new();
    }
}