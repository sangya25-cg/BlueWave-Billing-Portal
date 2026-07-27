using BlueWave_BP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlueWave_BP.API.Data
{
    public static class SanitaryDataSeeder
    {
        public static async Task ReseedAsync(ApplicationDbContext context, ILogger logger)
        {
            var now = DateTime.Now;

            await using var transaction = await context.Database.BeginTransactionAsync();

            context.BuyerProductPrices.RemoveRange(context.BuyerProductPrices);
            context.Products.RemoveRange(context.Products);
            context.Categories.RemoveRange(context.Categories);
            await context.SaveChangesAsync();

            var categories = new List<Category>
            {
                new() { Name = "Taps", Description = "Bathroom and utility taps", CreatedAt = now, UpdatedAt = now },
                new() { Name = "Showers", Description = "Shower fittings", CreatedAt = now, UpdatedAt = now },
                new() { Name = "Wash Basins", Description = "Ceramic and wall-mounted basins", CreatedAt = now, UpdatedAt = now },
                new() { Name = "Drainage Covers", Description = "Drain and grating covers", CreatedAt = now, UpdatedAt = now }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();

            var categoryIdByName = categories.ToDictionary(x => x.Name, x => x.Id);

            var products = new List<Product>
            {
                new() { CategoryId = categoryIdByName["Taps"], ModelName = "Swan Neck Tap", DefaultPrice = 1450m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Taps"], ModelName = "Wall Mounted Tap", DefaultPrice = 1325m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Taps"], ModelName = "Bib Cock Tap", DefaultPrice = 980m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Taps"], ModelName = "Pillar Cock Tap", DefaultPrice = 1125m, IsActive = true, CreatedAt = now, UpdatedAt = now },

                new() { CategoryId = categoryIdByName["Showers"], ModelName = "Rain Shower", DefaultPrice = 2750m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Showers"], ModelName = "Hand Shower", DefaultPrice = 1150m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Showers"], ModelName = "Overhead Shower", DefaultPrice = 1950m, IsActive = true, CreatedAt = now, UpdatedAt = now },

                new() { CategoryId = categoryIdByName["Wash Basins"], ModelName = "Premium Wash Basin", DefaultPrice = 4200m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Wash Basins"], ModelName = "Wall Hung Wash Basin", DefaultPrice = 3650m, IsActive = true, CreatedAt = now, UpdatedAt = now },

                new() { CategoryId = categoryIdByName["Drainage Covers"], ModelName = "Stainless Steel Drain Cover", DefaultPrice = 850m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Drainage Covers"], ModelName = "Heavy Duty Drain Grating", DefaultPrice = 1320m, IsActive = true, CreatedAt = now, UpdatedAt = now },
                new() { CategoryId = categoryIdByName["Drainage Covers"], ModelName = "PVC Drain Cover", DefaultPrice = 420m, IsActive = true, CreatedAt = now, UpdatedAt = now }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            var buyers = await context.Buyers.OrderBy(x => x.Id).ToListAsync();
            if (buyers.Count < 6)
            {
                var additionalBuyers = new List<Buyer>
                {
                    new()
                    {
                        PartyName = "AquaFlow Distributors",
                        Mobile = "9000000001",
                        Email = "aquaflow@example.com",
                        BillingAddress = "Industrial Area Phase 1",
                        State = "Maharashtra",
                        City = "Pune",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new()
                    {
                        PartyName = "UrbanSan Traders",
                        Mobile = "9000000002",
                        Email = "urbansan@example.com",
                        BillingAddress = "Main Market Road",
                        State = "Karnataka",
                        City = "Bengaluru",
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };

                await context.Buyers.AddRangeAsync(additionalBuyers);
                await context.SaveChangesAsync();
            }

            var pricingBuyers = await context.Buyers
                .OrderBy(x => x.Id)
                .ToListAsync();

            var buyerProductPrices = new List<BuyerProductPrice>();
            for (var buyerIndex = 0; buyerIndex < pricingBuyers.Count; buyerIndex++)
            {
                var buyer = pricingBuyers[buyerIndex];
                var buyerDiscount = Math.Min(0.12m, buyerIndex * 0.015m);

                for (var productIndex = 0; productIndex < products.Count - 3; productIndex++)
                {
                    var product = products[productIndex];
                    var variation = (productIndex % 3) switch
                    {
                        0 => -0.005m,
                        1 => 0m,
                        _ => 0.005m
                    };

                    var adjustedRate = product.DefaultPrice * (1m - buyerDiscount + variation);
                    var finalRate = decimal.Round(Math.Max(adjustedRate, 1m), 2, MidpointRounding.AwayFromZero);

                    buyerProductPrices.Add(new BuyerProductPrice
                    {
                        BuyerId = buyer.Id,
                        ProductId = product.Id,
                        Rate = finalRate,
                        CreatedAt = now,
                        UpdatedAt = now
                    });
                }
            }

            await context.BuyerProductPrices.AddRangeAsync(buyerProductPrices);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            logger.LogInformation(
                "Sanitary data reseeded. Categories: {CategoryCount}, Products: {ProductCount}, BuyerProductPrices: {PriceCount}",
                categories.Count,
                products.Count,
                buyerProductPrices.Count);
        }
    }
}