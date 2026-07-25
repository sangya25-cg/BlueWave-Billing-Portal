import api from "./api";

// Old function kept for reference
export const getProductsByBuyer = async (buyerId) => {
  const response = await api.get(`/BuyerProductPrice/buyer/${buyerId}`);
  return response.data;
};

// Fetch ALL products and resolve price:
// - If a custom buyer price exists for this buyer+product → use that
// - Otherwise → use the product's default price
export const getAllProductsWithPrice = async (buyerId) => {
  const [allProductsRes, buyerPricesRes] = await Promise.all([
    api.get("/Product"),
    api.get(`/BuyerProductPrice/buyer/${buyerId}`),
  ]);

  const allProducts = allProductsRes.data;
  const buyerPrices = buyerPricesRes.data;

  // Build a lookup map: productId -> custom rate
  const priceMap = {};
  buyerPrices.forEach((bp) => {
    priceMap[bp.productId] = bp.rate;
  });

  // Merge: for each product, use custom price if available, else default
  return allProducts.map((product) => ({
    productId: product.id,
    productName: product.modelName,
    rate: priceMap[product.id] !== undefined ? priceMap[product.id] : product.defaultPrice,
    hasCustomPrice: priceMap[product.id] !== undefined,
  }));
};