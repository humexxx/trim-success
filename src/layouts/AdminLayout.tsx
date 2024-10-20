import { AdminRoute } from "src/components";
import { LocalThemeProvider } from "src/context";

import { BaseLayout } from "./BaseLayout";

export default function AdminLayout() {
  return (
    <AdminRoute>
      <LocalThemeProvider>
        <BaseLayout />
      </LocalThemeProvider>
    </AdminRoute>
  );
}
