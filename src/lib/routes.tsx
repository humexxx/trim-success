import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignUpPage, SignInPage, ForgotPasswordPage } from "src/pages/auth";
import { SalesPage } from "src/pages/sales";

import { InventoryLayout, SalesLayout, ModuleSelectLayout } from "../layouts";
import { LandingPage, ErrorPage, ModuleSelector } from "../pages";
import { ROUTES } from "./consts";
import { TestingPage, UserSelectPage } from "../pages/admin";
import {
  AIPage,
  DashboardPage,
  ImportPage,
  ScorecardPage,
  SettingsPage,
  GeneralDataPage,
  DataMiningPage,
  InventoryPerformancePage,
} from "../pages/inventory";

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
    path: ROUTES.SIGN_IN,
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
    path: ROUTES.MODULE_SELECTOR,
    element: <ModuleSelectLayout />,

    children: [
      {
        path: ROUTES.MODULE_SELECTOR,
        element: <ModuleSelector />,
      },
    ],
  },
  {
    path: "/inventory",
    element: <InventoryLayout />,
    children: [
      {
        path: ROUTES.INVENTORY.ADMIN.IMPERSONATE,
        element: <UserSelectPage />,
      },
      {
        path: "/inventory/settings",
        element: <SettingsPage />,
      },
      {
        path: ROUTES.INVENTORY.IMPORT,
        element: <ImportPage />,
      },

      {
        path: ROUTES.INVENTORY.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: "/inventory/general-data",
        element: <GeneralDataPage />,
      },
      {
        path: ROUTES.INVENTORY.DATA_MINING,
        element: <DataMiningPage />,
      },
      {
        path: "/inventory/scorecard",
        element: <ScorecardPage />,
      },
      {
        path: "/inventory/inventory-performance",
        element: <InventoryPerformancePage />,
      },
      {
        path: "/inventory/admin/testing",
        element: <TestingPage />,
      },
      {
        path: "/inventory/ai",
        element: <AIPage />,
      },
    ],
  },
  {
    path: ROUTES.SALES,
    element: <SalesLayout />,
    children: [
      {
        path: ROUTES.SALES,
        element: <SalesPage />,
      },
    ],
  },
]);
