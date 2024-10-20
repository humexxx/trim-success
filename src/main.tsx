import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context";
import { router } from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthProvider>
    <CssBaseline />
    <RouterProvider router={router} />
  </AuthProvider>
  // </React.StrictMode>
);
