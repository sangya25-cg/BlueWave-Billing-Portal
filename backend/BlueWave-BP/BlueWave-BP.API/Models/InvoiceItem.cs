namespace BlueWave_BP.API.Models
{
    public class InvoiceItem
    {
        public int Id { get; set; }

        public int InvoiceId { get; set; }

        public int ProductId { get; set; }

        public int Qty { get; set; }

        public decimal Rate { get; set; }

        public decimal Amount { get; set; }

        public decimal GstRate { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}