import api from "./api";

export const getAllCategories = async () => {
  const response = await api.get("/Category");
  return response.data;
};
