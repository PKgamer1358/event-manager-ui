import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { getStoredToken } from "./auth";

export const API_BASE_URL = Capacitor.isNativePlatform()
  // ? "http://10.0.2.2:8000" // ANDROID EMULATOR
  ? "http://10.89.36.187:8000" // REAL DEVICE (same Wi-Fi)
  : "http://127.0.0.1:8000";

console.log("API BASE URL:", API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken(); // 🔥 IMPORTANT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
