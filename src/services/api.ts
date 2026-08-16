import axios from "axios";
import Lien from "../route/BASE_URL";

const api = axios.create({
  baseURL: Lien.REST_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
