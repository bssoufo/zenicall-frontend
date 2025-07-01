import React, { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ContactPage from "../modules/users/pages/MyAccountPage.tsx";
import NotFoundPage from "../@zenidata/pages/NotFoundPage";
import ForgotPasswordPage from "../modules/auth/pages/forgot-password/ForgotPasswordPage";
import LoginPage from "../modules/auth/pages/login/LoginPage";
import RegisterPage from "../modules/auth/pages/register/RegisterPage";
import ResetPasswordPage from "../modules/auth/pages/reset-password/ResetPasswordPage";
import ValidateRegistrationPage from "../modules/auth/pages/validate-registration/ValidateRegistrationPage";
import VerifyCodePage from "../modules/auth/pages/verify-code/VerifyCodePage";
import { AuthContext } from "../modules/auth/contexts/AuthContext";
import DashboardPage from "../modules/home/pages/DashboardPage";
import AppLayout from "../core/Layout/AppLayout";
import AuthLayout from "../core/Layout/AuthLayout";
import Lab from "../modules/debug/pages/Lab";
import SupportPage from "../modules/home/pages/support/SupportPage";
import MyAccountPage from "../modules/users/pages/MyAccountPage.tsx";
import TermsAndPrivacy from "../modules/home/pages/support/TermsAndPrivacy.tsx";
import ErrorPage from "../@zenidata/pages/ErrorPage.tsx";
import ClinicListPage from "../modules/clinics/pages/ClinicListPage";
import AddClinicPage from "../modules/clinics/pages/AddClinicPage";
import ClinicDetailsPage from "../modules/clinics/pages/ClinicDetailsPage";
import CallLogListPage from "../modules/call-logs/pages/CallLogListPage";
import CallLogDetailPage from "../modules/call-logs/pages/CallLogDetailPage";

// const AppLayout: React.FC = () => (
//   <div>
//     {/* Header */}
//     <header>Header</header>
//     {/* Main content */}
//     <main>
//       <Outlet />
//     </main>
//     {/* Footer */}
//     <footer>Footer</footer>
//   </div>
// );

interface Props {
  requiredPermissions?: string[];
  children: React.ReactNode;
}
const PrivateRoute: React.FC<Props> = ({
  children,
}: // requiredPermissions,
Props) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // if (requiredPermissions) {
  //   const hasPermission = requiredPermissions.some((permission) =>
  //     user.permissions?.includes(permission)
  //   );

  //   if (!hasPermission) {
  //     return <Navigate to="/" />;
  //   }
  // }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "lab",
    element: <Lab />,
  },
  {
    path: "error",
    element: <ErrorPage />,
  },
  {
    path: "terms-and-privacy-policy",
    element: <TermsAndPrivacy />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-code",
        element: <VerifyCodePage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/validate-registration",
        element: <ValidateRegistrationPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/clinics",
        element: (
          <PrivateRoute>
            <ClinicListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/clinics/create",
        element: (
          <PrivateRoute>
            <AddClinicPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/clinics/:clinicId",
        element: (
          <PrivateRoute>
            <ClinicDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/clinics/:clinicId/call-logs",
        element: (
          <PrivateRoute>
            <CallLogListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/clinics/:clinicId/call-logs/:callLogId",
        element: (
          <PrivateRoute>
            <CallLogDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <PrivateRoute>
            <ContactPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/support",
        element: (
          <PrivateRoute>
            <SupportPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateRoute>
            <MyAccountPage />
          </PrivateRoute>
        ),
      },
      {
        path: "not-found",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/not-found" />,
      },
    ],
  },
]);
const AppRoutes: React.FC = () => <RouterProvider router={router} />;
export default AppRoutes;
