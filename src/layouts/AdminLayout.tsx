import { ThemeProvider } from "src/context/theme";
import { AdminRoute } from "src/components";
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
