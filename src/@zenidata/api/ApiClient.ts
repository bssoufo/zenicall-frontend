import axios from "axios";
import { AppEnv } from "../../config/AppEnv";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const apiClient = axios.create({
  baseURL: AppEnv.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAxiosErrorHandingInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          // Erreur réseau (ex: pas d'internet)
          navigate("/error", {
            state: { message: "Network issue. Please check your connection." },
          });
        } else if (error.response.status >= 500) {
          // Erreur serveur (500, 502, 503, etc.)
          navigate("/error", {
            state: { message: "Server error. Please try again later." },
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
};

export type ErrorResponse<T> = {
  [key: string]: T;
};

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data);
    // throw new Error(
    return error.response?.data.error_key || "An unknown Axios error occurred.";
    // );
  } else {
    console.error("Non-Axios error:", error);
    throw new Error("Erreur réseau lors de la suppression du dossier.");
  }
}

export default apiClient;
