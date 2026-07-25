namespace BlueWave_BP.API.DTOs
{
    public class AssignBuyerProductPriceDto
    {
        public int BuyerId { get; set; }

        public int ProductId { get; set; }

        public decimal Rate { get; set; }
    }
}