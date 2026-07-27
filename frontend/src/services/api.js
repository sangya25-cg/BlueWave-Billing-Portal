import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api", // Replace with your backend url
});

export default api;