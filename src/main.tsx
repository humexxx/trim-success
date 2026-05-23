import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import { DemoRibbon } from "./components";
import { AuthProvider, LocalThemeProvider } from "./context";
import { router } from "./lib/routes.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LocalThemeProvider>
      <RouterProvider router={router} />
      {/* Sibling of RouterProvider so it floats over every route. The
          component itself decides if it should render based on env +
          signed-in account. */}
      <DemoRibbon />
    </LocalThemeProvider>
  </AuthProvider>
);
