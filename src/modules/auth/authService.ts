// src/services/authService.js

// import axios from "axios";
import User from "../users/UserModel"; // Import the UserModel
// import { AppEnv } from "../config/AppEnv";
import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";

// Définir l'URL de base à partir des variables d'environnement
// const API_BASE_URL = AppEnv.API_BASE_URL;

// Créer une instance Axios avec l'URL de base
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // Assurez-vous que le token est stocké correctement
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

/**
 * Fonction de connexion qui appelle l'API.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Les données de l'utilisateur si la connexion est réussie.
 */
export const loginService = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

/**
 * Fonction de déconnexion qui appelle l'API.
 * @returns {Promise<Object>} La réponse de l'API après la déconnexion.
 */
export const logoutService = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

/**
 * Fonction pour demander une réinitialisation de mot de passe.
 * @param {string} email
 * @returns {Promise<Object>} La réponse de l'API.
 */
export const forgotPasswordService = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Fonction pour vérifier le code de réinitialisation.
 * @param {string} email
 * @param {string} code
 * @returns {Promise<Object>} La réponse de l'API.
 */
export const verifyCodeService = async (email: string, code: string) => {
  const response = await apiClient.post("/auth/verify-code", { email, code });
  return response.data;
};

/**
 * Fonction pour réinitialiser le mot de passe.
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise<Object>} La réponse de l'API.
 */
export const resetPasswordService = async (
  email: string,
  newPassword: string
) => {
  const response = await apiClient.post("/auth/reset-password", {
    email,
    new_password: newPassword,
  });
  return response.data;
};

/**
 * Fonction pour s'inscrire.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} La réponse de l'API.
 */
export const registerService = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  // Create a UserModel instance with username equal to email
  const user = new User(
    firstName,
    lastName,
    email,
    email, // Set username to email
    password
  );

  const response = await apiClient.post("/auth/register", user);
  return response.data;
};

/**
 * Fonction pour valider l'inscription avec un code de validation.
 * @param {string} email
 * @param {string} code
 * @returns {Promise<Object>} La réponse de l'API.
 */
export const validateRegistrationService = async (
  email: string,
  code: string
) => {
  try {
    const response = await apiClient.post("/auth/validate-registration", {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const contactService = async (
  name: string,
  email: string,
  subject: string,
  category: string,
  urgence: string,
  message: string
) => {
  // try {
  const response = await apiClient.post("/contact/submit", {
    name,
    email,
    subject,
    category,
    urgence,
    message,
  });
  return response;
  // } catch (error) {
  //   handleAxiosError(error);
  // }
};

export const updateProfileService = async (payload: {
  first_name: string;
  last_name: string;
  password?: string;
  password_confirmation?: string;
}) => {
  const response = await apiClient.put("/auth/me", payload);
  return response.data;
};

// Vous pouvez ajouter d'autres fonctions API ici, par exemple:
// export const someOtherService = async (params) => { ... };
