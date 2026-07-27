import api from "./api";

export const getAllBuyers = async () => {
  const response = await api.get("/Buyer");
  return response.data;
};

export const createBuyer = async (buyerData) => {
  const response = await api.post("/Buyer", buyerData);
  return response.data;
};