namespace BlueWave_BP.API.DTOs
{
    public class InvoiceListItemDto
    {
        public int InvoiceId { get; set; }

        public string InvoiceNo { get; set; } = string.Empty;

        public string BuyerName { get; set; } = string.Empty;

        public DateTime InvoiceDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}