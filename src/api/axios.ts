import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/auth/orders/admin/all",
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);