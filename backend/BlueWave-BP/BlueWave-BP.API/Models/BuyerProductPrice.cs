namespace BlueWave_BP.API.Models
{
    public class BuyerProductPrice
    {
        public int Id { get; set; }

        public int BuyerId { get; set; }

        public int ProductId { get; set; }

        public decimal Rate { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}