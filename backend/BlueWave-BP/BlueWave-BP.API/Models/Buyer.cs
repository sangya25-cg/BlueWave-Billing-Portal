namespace BlueWave_BP.API.Models
{
    public class Buyer
    {
        public int Id { get; set; }

        public string PartyName { get; set; } = string.Empty;

        public string? Gstin { get; set; }

        public string? Mobile { get; set; }

        public string? Email { get; set; }

        public string? BillingAddress { get; set; }

        public string? State { get; set; }

        public string? City { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}