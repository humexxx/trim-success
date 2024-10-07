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
  DataMiningPage,
  InventoryPerformancePage,
} from "./pages/client";
import { TestPage, UserSelectPage } from "./pages/admin";
import { ClientLayout } from "./layouts";

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
        path: "/client/impersonate",
        element: <UserSelectPage />,
      },
      {
        path: "/client/settings",
        element: <SettingsPage />,
      },
      {
        path: "/client/import",
        element: <ImportPage />,
      },

      {
        path: "/client/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/client/general-data",
        element: <GeneralDataPage />,
      },
      {
        path: "/client/data-mining",
        element: <DataMiningPage />,
      },
      {
        path: "/client/scorecard",
        element: <ScorecardPage />,
      },
      {
        path: "/client/inventory-performance",
        element: <InventoryPerformancePage />,
      },
      {
        path: "/client/testing",
        element: <TestPage />,
      },
      {
        path: "/client/ai",
        element: <AIPage />,
      },
    ],
  },
]);
