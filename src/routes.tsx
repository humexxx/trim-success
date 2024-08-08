import { createBrowserRouter, Navigate } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import {
  LandingPage,
  ErrorPage,
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
} from "./pages";
import { DashboardPage, ImportPage, UserPage } from "./pages/client";
import { CubeLayout } from "./layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <Navigate replace to="/login" />,
  },
  {
    path: "/login",
    element: <SignInPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/client",
    element: <ClientLayout />,
    children: [
      {
        path: "/client/user",
        element: <UserPage />,
      },
      {
        path: "/client/import",
        element: <ImportPage />,
      },
      {
        path: "/client",
        element: <CubeLayout />,
        children: [
          {
            path: "/client/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/client/reports",
            element: <>My Reports</>,
          },
        ],
      },
    ],
  },
]);
