import { useCallback, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { CubeProvider, LocalThemeProvider } from "src/context";
import { useAuth, useCube } from "src/context/hooks";
import { ROUTES, VERSION } from "src/lib/consts";

import { Header, Sidenav } from "./_components";

function SalesLayout() {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const cube = useCube();

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Header handleDrawerToggle={handleDrawerToggle} />

      <Sidenav
        title="Sales"
        version={VERSION}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsClosing={setIsClosing}
      />

      <main className="flex-1 px-6 pt-20 lg:pl-[calc(240px+1.5rem)]">
        <div className="mx-auto max-w-7xl">
          {cube.isCubeLoading ? "Loading..." : <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default function SalesLayoutWrapper() {
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
          <SalesLayout />
        </CubeProvider>
      </LocalThemeProvider>
    </PrivateRoute>
  );
}
