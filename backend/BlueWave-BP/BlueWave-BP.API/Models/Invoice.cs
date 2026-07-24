namespace BlueWave_BP.API.Models
{
    public class Invoice
    {
        public int Id { get; set; }

        public string InvoiceNo { get; set; } = string.Empty;

        public int BuyerId { get; set; }

        public DateTime InvoiceDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string? PdfPath { get; set; }

        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}