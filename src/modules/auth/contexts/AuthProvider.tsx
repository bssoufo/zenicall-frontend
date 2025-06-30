//src\modules\auth\contexts\AuthProvider.tsx
import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { AuthContext } from "./AuthContext";

import {
  loginService,
  logoutService,
  forgotPasswordService,
  verifyCodeService,
  resetPasswordService,
  registerService,
  validateRegistrationService,
  updateProfileService,
  contactService,
} from "../authService";
import getErrorMessageFromCode from "../../../core/constants/ErrorHandling";
import { useTranslation } from "react-i18next";
import { AlertMessage } from "../../../@zenidata/models/Shared";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth === "true";
  });

  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const data = await loginService(email, password);
      setIsAuthenticated(true);
      const { access_token, ...userWithoutToken } = data;
      setUser(userWithoutToken);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userWithoutToken));
      localStorage.setItem("token", access_token);
      setAlertMessage(null);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);

      // if (error instanceof AxiosError) {
      //   const errorMessage = getErrorMessageFromCode(
      //     error.response?.data.error_key,
      //     i18n.language as any
      //   );
      //   // setAuthError(error.response?.data?.api_message || "generic_error");

      //   setAlertMessage({
      //     type: "error",
      //     content: errorMessage,
      //   });
      //   console.log(errorMessage);
      // }
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setAlertMessage(null);
    // setLoggingOut(true);
    try {
      // await logoutService();
      setIsAuthenticated(false);
      setUser(null);
      // setAuthError("LOGOUT_SUCCESS");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // setLoggingOut(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // setAlertMessage({
      //   type: "error",
      //   content: "LOGOUT_ERROR",
      // });
    } finally {
      // setLoggingOut(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await forgotPasswordService(email);
      setAlertMessage(null);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await verifyCodeService(email, code);
      setAlertMessage(null);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await resetPasswordService(email, newPassword);
      setAlertMessage(null);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await registerService(
        firstName,
        lastName,
        email,
        password
      );
      setAlertMessage(null);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateRegistration = async (email: string, code: string) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await validateRegistrationService(email, code);
      setAlertMessage(null);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // const contact = async (
  //   name: string,
  //   email: string,
  //   subject: string,
  //   category: string,
  //   urgence: string,
  //   message: string
  // ) => {
  //   setAlertMessage(null);
  //   setLoading(true);
  //   try {
  //     const response = await contactService(
  //       name,
  //       email,
  //       subject,
  //       category,
  //       urgence,
  //       message
  //     );
  //     setAlertMessage(null);
  //     return response;
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       setAlertMessage({
  //         type: "error",
  //         content: error.response?.data?.api_message || "generic_error",
  //       });
  //     }
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // src\modules\auth\contexts\AuthProvider.tsx
  const udpateProfile = async (
    firstName: string,
    lastName: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const payload: {
        first_name: string;
        last_name: string;
        password?: string;
        password_confirmation?: string;
      } = {
        first_name: firstName,
        last_name: lastName,
      };

      if (password.trim()) {
        payload.password = password;
        payload.password_confirmation = passwordConfirmation;
      }

      const response = await updateProfileService(payload);

      // Update user in state and localStorage
      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.error("Erreur lors de la mise à jour du profil:", response);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setAlertMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      setAlertMessage(null);
    }
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        alertMessage,
        setAlertMessage,
        loading,
        // loggingOut,
        forgotPassword,
        verifyCode,
        resetPassword,
        register,
        validateRegistration,
        // contact,
        udpateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
