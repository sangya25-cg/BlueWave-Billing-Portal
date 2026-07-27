import api from "./api";

export const createInvoice = async (invoiceData) => {
  const response = await api.post(
    "/Invoice",
    invoiceData
  );

  return response.data;
};

export const getAllInvoices = async () => {
  const response = await api.get("/Invoice");
  return response.data;
};