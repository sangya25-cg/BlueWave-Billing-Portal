import axios from "axios";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5002";
const normalizedApiBaseUrl = configuredApiBaseUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${normalizedApiBaseUrl}/api`,
});

export default api;