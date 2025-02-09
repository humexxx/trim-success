import { useState } from "react";

import { Box, Drawer, Toolbar, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { VERSION } from "src/lib/consts";
import { useCube } from "src/context/hooks";

import { Sidenav, Header } from "./components";
import { SIDENAV_WIDTH } from "./components/Sidenav";

export default function BaseLayout() {
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
        sx={{ width: { lg: SIDENAV_WIDTH }, flexShrink: { sm: 0 } }}
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
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDENAV_WIDTH,
            },
          }}
        >
          <Sidenav title="Trim Success" version={VERSION} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDENAV_WIDTH,
            },
          }}
          open
        >
          <Sidenav title="Trim Success" version={VERSION} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
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
