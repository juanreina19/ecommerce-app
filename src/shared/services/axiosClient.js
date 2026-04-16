import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io";

export const TOKEN_KEY = "jwt_token";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  timeout: 15000,
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
// Inyecta el JWT en cada petición si existe
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("TOKEN ENVIADO:", token ? token.substring(0, 30) + "..." : "NO HAY TOKEN");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) { }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
// Maneja errores globales (401, 403, 500…)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token expirado: limpiar almacenamiento
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => { });
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Error de conexión";

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
