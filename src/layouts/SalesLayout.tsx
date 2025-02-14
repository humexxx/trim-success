import { useCallback, useState } from "react";

import { Box, Toolbar, Container } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { LocalThemeProvider, CubeProvider } from "src/context";
import { useAuth, useCube } from "src/context/hooks";
import { ROUTES, VERSION } from "src/lib/consts";

import { Header, Sidenav } from "./_components";
import { SIDENAV_WIDTH } from "./_components/Sidenav";

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
    <Box sx={{ display: "flex" }}>
      <Header handleDrawerToggle={handleDrawerToggle} />

      <Sidenav
        title="Inventory"
        version={VERSION}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsClosing={setIsClosing}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 0,
          width: { lg: `calc(100% - ${SIDENAV_WIDTH}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Container maxWidth="xl">
          {cube.isCubeLoading ? "Loading..." : <Outlet />}
        </Container>
      </Box>
    </Box>
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
          <SalesLayout />
        </CubeProvider>
      </LocalThemeProvider>
    </PrivateRoute>
  );
}
