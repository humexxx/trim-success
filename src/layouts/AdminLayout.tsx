import { AdminRoute } from "src/components";
import { ThemeProvider } from "src/context/theme";

import { BaseLayout } from "./BaseLayout";

export default function AdminLayout() {
  return (
    <AdminRoute>
      <ThemeProvider>
        <BaseLayout />
      </ThemeProvider>
    </AdminRoute>
  );
}
