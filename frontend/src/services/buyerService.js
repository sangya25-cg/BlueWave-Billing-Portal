import api from "./api";

export const getAllBuyers = async () => {
  const response = await api.get("/Buyer");
  return response.data;
};