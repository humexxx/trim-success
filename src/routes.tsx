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
  GeneralDataPage,
  CATPage,
} from "./pages/client";
import { ClientLayout, CubeLayout } from "./layouts";
import { AdminImportPage } from "./pages/client/ImportPage";

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
        path: "/client/import-admin",
        element: <AdminImportPage />,
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
            path: "/client/general-data",
            element: <GeneralDataPage />,
          },
          {
            path: "/client/cat",
            element: <CATPage />,
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
