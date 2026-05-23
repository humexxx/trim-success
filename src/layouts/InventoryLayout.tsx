import { useCallback, useState } from "react";

import {
  ChartLine,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  Loader2,
  Settings,
  Sparkles,
  TestTubeDiagonal,
  UserCog,
  Users,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { CubeProvider, LocalThemeProvider } from "src/context";
import { useAuth, useCube } from "src/context/hooks";
import { ROUTES, VERSION } from "src/lib/consts";

import { Separator } from "@/components/ui/separator";

import {
  Header,
  Sidenav,
  SidenavLink,
  SidenavSection,
} from "./_components";

const dataImportRoutes = (isAdmin: boolean) =>
  [
    {
      admin: true,
      text: "Impersonar",
      icon: <Users className="h-4 w-4" />,
      path: "/inventory/admin/impersonate",
    },
    {
      text: "Importar",
      icon: <Download className="h-4 w-4" />,
      path: "/inventory/import",
      requireContextUid: true,
    },
  ].filter((route) => (route.admin ? isAdmin : true));

const dataVisualizationsRoutes = [
  {
    text: "Panel",
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: "/inventory/dashboard",
    requireInitialData: true,
  },
  {
    text: "Generales",
    icon: <FileText className="h-4 w-4" />,
    path: "/inventory/general-data",
    requireInitialData: true,
  },
];

const dataAnalyticsRoutes = [
  {
    text: "Data Mining",
    icon: <Filter className="h-4 w-4" />,
    path: ROUTES.INVENTORY.DATA_MINING,
    requireInitialData: true,
  },
  {
    text: "Scorecard",
    icon: <ChartLine className="h-4 w-4" />,
    path: "/inventory/scorecard",
    requireInitialData: true,
  },
  {
    text: "Inventario",
    icon: <UserCog className="h-4 w-4" />,
    path: "/inventory/inventory-performance",
    requireInitialData: true,
  },
];

const secondaryRoutes = (isAdmin: boolean) => {
  return [
    {
      text: "IA",
      icon: <Sparkles className="h-4 w-4" />,
      path: "/inventory/ai",
      requireInitialData: true,
      disabled: true,
    },
    {
      admin: true,
      text: "Testing",
      icon: <TestTubeDiagonal className="h-4 w-4" />,
      requireInitialData: true,
      path: "/inventory/admin/testing",
    },
  ].filter((route) => (route.admin ? isAdmin : true));
};

function InventoryLayout() {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { hasInitialData, isCubeLoading } = useCube();
  const { isAdmin, customUser } = useAuth();

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidenav
        title="Inventory"
        version={VERSION}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsClosing={setIsClosing}
      >
        <SidenavSection>
          <SidenavLink
            to={ROUTES.MODULE_SELECTOR}
            icon={<LayoutDashboard className="h-4 w-4" />}
          >
            Modulos
          </SidenavLink>
        </SidenavSection>

        <Separator />

        <SidenavSection label="Data Import">
          {dataImportRoutes(isAdmin).map(
            ({ text, icon, path, requireContextUid }) => (
              <SidenavLink
                key={text}
                to={path}
                icon={icon}
                disabled={requireContextUid && isAdmin && !customUser?.uid}
              >
                {text}
              </SidenavLink>
            )
          )}
        </SidenavSection>

        <SidenavSection label="Resumen">
          {dataVisualizationsRoutes.map(
            ({ text, icon, path, requireInitialData }) => (
              <SidenavLink
                key={text}
                to={path}
                icon={icon}
                disabled={requireInitialData && !hasInitialData}
              >
                {text}
              </SidenavLink>
            )
          )}
        </SidenavSection>

        <SidenavSection label="Data Analytics">
          {dataAnalyticsRoutes.map(
            ({ text, icon, path, requireInitialData }) => (
              <SidenavLink
                key={text}
                to={path}
                icon={icon}
                disabled={requireInitialData && !hasInitialData}
              >
                {text}
              </SidenavLink>
            )
          )}
        </SidenavSection>

        <div className="flex-1" />

        <SidenavSection>
          {secondaryRoutes(isAdmin).map(
            ({ text, icon, path, requireInitialData, disabled }) => (
              <SidenavLink
                key={text}
                to={path}
                icon={icon}
                disabled={(requireInitialData && !hasInitialData) || disabled}
              >
                {text}
              </SidenavLink>
            )
          )}
        </SidenavSection>

        <Separator />

        <SidenavSection>
          <SidenavLink
            to="/inventory/settings"
            icon={<Settings className="h-4 w-4" />}
            disabled={isCubeLoading}
          >
            Settings
          </SidenavLink>
        </SidenavSection>
      </Sidenav>

      <main className="flex-1 px-6 pt-20 lg:pl-[calc(240px+1.5rem)]">
        {isCubeLoading ? (
          <div className="mt-4 flex items-center gap-2 text-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando...</span>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default function InventoryLayoutWrapper() {
  const navigate = useNavigate();
  const { isAdmin, customUser } = useAuth();

  const onCubeLoadError = useCallback(() => {
    if (isAdmin && !customUser?.uid)
      navigate(ROUTES.INVENTORY.ADMIN.IMPERSONATE, { replace: true });
    else navigate(ROUTES.INVENTORY.IMPORT, { replace: true });
  }, [customUser?.uid, isAdmin, navigate]);

  return (
    <PrivateRoute>
      <LocalThemeProvider>
        <CubeProvider onCubeLoadError={onCubeLoadError}>
          <InventoryLayout />
        </CubeProvider>
      </LocalThemeProvider>
    </PrivateRoute>
  );
}
