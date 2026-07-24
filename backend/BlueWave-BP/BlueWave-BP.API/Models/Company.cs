namespace BlueWave_BP.API.Models
{
    public class Company
    {
        public int Id { get; set; }

        public string CompanyName { get; set; } = string.Empty;

        public string? Gstin { get; set; }

        public string? Mobile { get; set; }

        public string? Email { get; set; }

        public string? BillingAddress { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? SignImagePath { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}
