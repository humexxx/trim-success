import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { LocalThemeProvider } from "src/context";

import { Header } from "./_components";

function ModuleSelectLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Header hasDrawer={false} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 0,
          width: "100%",
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

export default function InventoryLayoutWrapper() {
  return (
    <PrivateRoute>
      <LocalThemeProvider>
        <ModuleSelectLayout />
      </LocalThemeProvider>
    </PrivateRoute>
  );
}
