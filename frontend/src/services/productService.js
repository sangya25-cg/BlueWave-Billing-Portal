import api from "./api";

export const getProductsByBuyer = async (buyerId) => {
  const response = await api.get(
    `/BuyerProductPrice/buyer/${buyerId}`
  );

  return response.data;
};