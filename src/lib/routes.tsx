import { lazy, Suspense } from "react";

import { Loader2 } from "lucide-react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ForgotPasswordPage, SignInPage } from "src/pages/auth";

import { ErrorPage, LandingPage } from "../pages";
import { ROUTES } from "./consts";

// Eagerly load the auth + landing chunk — these pages must paint
// instantly on first visit. Everything else (inventory, sales, admin)
// is route-split so a logged-in user never pays for code they don't
// visit, and an anonymous visitor never pays for the inventory bundle.
// Aligned with bundle-dynamic-imports from the Vercel React Best
// Practices skill.

const ModuleSelectLayout = lazy(() => import("../layouts/ModuleSelectLayout"));
const InventoryLayout = lazy(() => import("../layouts/InventoryLayout"));
const SalesLayout = lazy(() => import("../layouts/SalesLayout"));

const ModuleSelector = lazy(() => import("../pages/ModuleSelector"));

const DashboardPage = lazy(() => import("../pages/inventory/dashboard/Page"));
const ScorecardPage = lazy(() => import("../pages/inventory/scorecard/Page"));
const SettingsPage = lazy(() => import("../pages/inventory/settings/Page"));
const GeneralDataPage = lazy(
  () => import("../pages/inventory/general-data/Page")
);
const DataMiningPage = lazy(
  () => import("../pages/inventory/data-mining/Page")
);
const ImportPage = lazy(() => import("../pages/inventory/import/Page"));
const InventoryPerformancePage = lazy(
  () => import("../pages/inventory/inventory-performance/Page")
);
const AIPage = lazy(() => import("../pages/inventory/ai/Page"));

const TestingPage = lazy(() => import("../pages/admin/testing/Page"));
const UserSelectPage = lazy(() => import("../pages/admin/user-select/Page"));

const SalesPage = lazy(() => import("../pages/sales/Page"));

// Public marketing / legal pages — anonymous-friendly, route-split so
// they don't pull the inventory bundle along.
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const ChangelogPage = lazy(() => import("../pages/public/ChangelogPage"));
const TermsPage = lazy(() => import("../pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("../pages/public/PrivacyPage"));

/**
 * Spinner shown briefly while a route chunk is loaded over the network.
 * Centered + full-viewport so it never causes layout shift inside any
 * particular layout — the page that finally renders replaces it.
 *
 * Co-located with the router on purpose — it's only used here and
 * splitting it out would just add an extra module for no value. The
 * Fast Refresh warning isn't a real concern: this file is the router
 * itself, not a hot-reloadable component module.
 */
// eslint-disable-next-line react-refresh/only-export-components
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}

const lazyRoute = (Component: React.ComponentType) => (
  <Suspense fallback={<RouteFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  { path: "/sign-up", element: <Navigate replace to="/login" /> },
  { path: ROUTES.SIGN_IN, element: <Navigate replace to="/login" /> },
  { path: "/login", element: <SignInPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },

  // Public footer pages.
  { path: ROUTES.PUBLIC.ABOUT, element: lazyRoute(AboutPage) },
  { path: ROUTES.PUBLIC.CHANGELOG, element: lazyRoute(ChangelogPage) },
  { path: ROUTES.PUBLIC.TERMS, element: lazyRoute(TermsPage) },
  { path: ROUTES.PUBLIC.PRIVACY, element: lazyRoute(PrivacyPage) },
  {
    path: ROUTES.MODULE_SELECTOR,
    element: lazyRoute(ModuleSelectLayout),
    children: [
      { path: ROUTES.MODULE_SELECTOR, element: lazyRoute(ModuleSelector) },
    ],
  },
  {
    path: "/inventory",
    element: lazyRoute(InventoryLayout),
    children: [
      {
        path: ROUTES.INVENTORY.ADMIN.IMPERSONATE,
        element: lazyRoute(UserSelectPage),
      },
      { path: "/inventory/settings", element: lazyRoute(SettingsPage) },
      { path: ROUTES.INVENTORY.IMPORT, element: lazyRoute(ImportPage) },
      { path: ROUTES.INVENTORY.DASHBOARD, element: lazyRoute(DashboardPage) },
      { path: "/inventory/general-data", element: lazyRoute(GeneralDataPage) },
      {
        path: ROUTES.INVENTORY.DATA_MINING,
        element: lazyRoute(DataMiningPage),
      },
      { path: "/inventory/scorecard", element: lazyRoute(ScorecardPage) },
      {
        path: "/inventory/inventory-performance",
        element: lazyRoute(InventoryPerformancePage),
      },
      { path: "/inventory/admin/testing", element: lazyRoute(TestingPage) },
      { path: "/inventory/ai", element: lazyRoute(AIPage) },
    ],
  },
  {
    path: ROUTES.SALES,
    element: lazyRoute(SalesLayout),
    children: [{ path: ROUTES.SALES, element: lazyRoute(SalesPage) }],
  },
]);
