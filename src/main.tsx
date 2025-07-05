import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider, LocalThemeProvider } from "./context";
import { router } from "./lib/routes.tsx";
import "@fontsource/roboto";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthProvider>
    <LocalThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </LocalThemeProvider>
  </AuthProvider>
  // </React.StrictMode>
);
