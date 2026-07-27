import api from "./api";

export const getProductsByBuyer = async (buyerId) => {
  const response = await api.get(`/BuyerProductPrice/buyer/${buyerId}`);
  return response.data;
};

export const getAllProductsWithPrice = async (buyerId) => {
  const [allProductsRes, buyerPricesRes] = await Promise.all([
    api.get("/Product"),
    api.get(`/BuyerProductPrice/buyer/${buyerId}`),
  ]);

  const allProducts = allProductsRes.data;
  const buyerPrices = buyerPricesRes.data;

  const priceMap = {};
  buyerPrices.forEach((bp) => {
    priceMap[bp.productId] = bp.rate;
  });

  return allProducts.map((product) => ({
    productId: product.id,
    productName: product.modelName,
    rate: priceMap[product.id] !== undefined ? priceMap[product.id] : product.defaultPrice,
    hasCustomPrice: priceMap[product.id] !== undefined,
  }));
};

export const createProduct = async (productData) => {
  const response = await api.post("/Product", productData);
  return response.data;
};