import axios from "axios";

export const api = axios.create({
  baseURL: "https://e-commas-apis-production.up.railway.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);
