import axios from "axios";
import Cookies from "js-cookie";

export const instanceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

instanceClient.interceptors.request.use(
  (config) => {
    let token = Cookies.get("nir_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
