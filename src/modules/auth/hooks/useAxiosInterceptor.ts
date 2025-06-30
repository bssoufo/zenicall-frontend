import { useNavigate } from "react-router-dom";
import apiClient from "../../../@zenidata/api/ApiClient";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAxiosInterceptor = () => {
  const { logout, setAlertMessage } = useContext(AuthContext);

  // alert("interceptor");
  const navigate = useNavigate();

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log("Error resp;:::", error);
      // console.log(error);
      if (error.response && error.response.status === 401) {
        // console.warn("Session expirée. Déconnexion...");
        // localStorage.removeItem("token");
        logout();
        setAlertMessage({
          type: "info",
          content: "SESSION_EXPIRED",
        });
        setTimeout(() => navigate("/login"), 500);
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
