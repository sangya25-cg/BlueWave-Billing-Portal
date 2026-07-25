import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7174/api", // Replace with your backend url
});

export default api;