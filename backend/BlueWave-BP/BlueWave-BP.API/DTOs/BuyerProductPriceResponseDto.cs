namespace BlueWave_BP.API.DTOs
{
    public class BuyerProductPriceResponseDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public decimal Rate { get; set; }
    }
}