import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  LandingPage,
  ErrorPage,
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
} from "./pages";
import {
  AIPage,
  DashboardPage,
  ImportPage,
  ScorecardPage,
  SettingsPage,
} from "./pages/client";
import { ClientLayout, CubeLayout } from "./layouts";

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
        path: "/client/settings",
        element: <SettingsPage />,
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
            path: "/client/scorecard",
            element: <ScorecardPage />,
          },
          {
            path: "/client/ai",
            element: <AIPage />,
          },
        ],
      },
    ],
  },
]);
