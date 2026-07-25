namespace BlueWave_BP.API.DTOs
{
    public class InvoiceResponseDto
    {
        public int InvoiceId { get; set; }

        public string InvoiceNo { get; set; } = string.Empty;

        public decimal Subtotal { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }
    }
}