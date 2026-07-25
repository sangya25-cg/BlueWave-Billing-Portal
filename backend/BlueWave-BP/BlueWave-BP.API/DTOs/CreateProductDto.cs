namespace BlueWave_BP.API.DTOs
{
    public class CreateProductDto
    {
        public int CategoryId { get; set; }

        public string ModelName { get; set; } = string.Empty;

        public decimal DefaultPrice { get; set; }
    }
}