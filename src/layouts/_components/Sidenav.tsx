import { PropsWithChildren } from "react";

import { Toolbar, Divider, Box, Typography, Drawer } from "@mui/material";

const SidenavContent = ({
  title,
  version,
  children,
}: PropsWithChildren<{
  title: string;
  version: string;
}>) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ position: "relative" }}>
          {title}{" "}
          <Typography
            mb={2}
            variant="caption"
            sx={{ position: "absolute", top: 2, ml: 1 }}
          >
            ({version})
          </Typography>
        </Typography>
      </Toolbar>
      <Divider />

      {children}
    </Box>
  );
};

interface Props {
  title: string;
  version: string;
  setIsMobileOpen: (open: boolean) => void;
  isMobileOpen: boolean;
  setIsClosing: (closing: boolean) => void;
}

function Sidenav({
  title,
  version,
  isMobileOpen,
  setIsMobileOpen,
  setIsClosing,
  children,
}: PropsWithChildren<Props>) {
  const handleDrawerClose = () => {
    setIsClosing(true);
    setIsMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <Box
      component="nav"
      sx={{ width: { lg: SIDENAV_WIDTH }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={isMobileOpen}
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
        <SidenavContent title={title} version={version}>
          {children}
        </SidenavContent>
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
        <SidenavContent title="Trim Success" version={version}>
          {children}
        </SidenavContent>
      </Drawer>
    </Box>
  );
}

export const SIDENAV_WIDTH = 240;

export default Sidenav;
