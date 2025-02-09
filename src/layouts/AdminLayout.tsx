import { AdminGuard } from "src/components";
import { LocalThemeProvider } from "src/context";

import { BaseLayout } from "./BaseLayout";

export default function AdminLayout() {
  return (
    <AdminGuard>
      <LocalThemeProvider>
        <BaseLayout />
      </LocalThemeProvider>
    </AdminGuard>
  );
}
