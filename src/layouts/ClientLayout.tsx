import { PrivateRoute } from "src/components/common";
import { Outlet } from "react-router-dom";
import APP_DRAWER, { DRAWER_WIDTH } from "src/components/layouts/drawer";

import { ThemeProvider } from "src/context/theme";
import { Header } from "src/components/layouts";
import { Box, Drawer, Toolbar, Container, LinearProgress } from "@mui/material";
import { CubeProvider, useCube } from "src/context/cube";
import { useState } from "react";

function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const cube = useCube();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <APP_DRAWER />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          <APP_DRAWER />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "background.paper",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {cube.loading ? (
          <LinearProgress />
        ) : (
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        )}
      </Box>
    </Box>
  );
}

export default function ClientLayoutWrapper() {
  return (
    <PrivateRoute>
      <CubeProvider>
        <ThemeProvider>
          <ClientLayout />
        </ThemeProvider>
      </CubeProvider>
    </PrivateRoute>
  );
}
