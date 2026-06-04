import {
  buildApiUrl,
  extractTenantFromHost,
} from "@/helpers/fetchers/fetch-utils";
import axios from "axios";
import Cookies from "js-cookie";

const { subdomain } = extractTenantFromHost();
const apiURL = buildApiUrl(subdomain, "/");

export const instanceClient = axios.create({
  baseURL: apiURL,
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
  },
);
