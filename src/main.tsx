import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import { AuthProvider, LocalThemeProvider } from "./context";
import { router } from "./lib/routes.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LocalThemeProvider>
      <RouterProvider router={router} />
    </LocalThemeProvider>
  </AuthProvider>
);
