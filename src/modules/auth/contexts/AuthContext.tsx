import { createContext } from "react";
import { AlertMessage } from "../../../@zenidata/models/Shared";

interface AuthObject {
  isAuthenticated: boolean;
  user: any;
  login: Function;
  logout: Function;
  alertMessage: AlertMessage | null;
  setAlertMessage: Function;
  loading: boolean;
  // loggingOut: boolean;
  forgotPassword: Function;
  verifyCode: Function;
  resetPassword: Function;
  register: Function;
  validateRegistration: Function;
  // contact: Function;
  udpateProfile: Function;
}

const initialValue: AuthObject = {
  isAuthenticated: false,
  user: {},
  login: () => {},
  logout: () => {},
  alertMessage: null,
  setAlertMessage: () => {},
  loading: false,
  // loggingOut: false,
  forgotPassword: () => {},
  verifyCode: () => {},
  resetPassword: () => {},
  register: () => {},
  validateRegistration: () => {},
  // contact: () => {},
  udpateProfile: () => {},
};

export const AuthContext = createContext<AuthObject>(initialValue);
