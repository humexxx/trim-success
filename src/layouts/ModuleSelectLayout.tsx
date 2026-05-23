import { Outlet } from "react-router-dom";
import { PrivateRoute } from "src/components";

import { Header } from "./_components";

function ModuleSelectLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Header hasDrawer={false} />
      <main className="w-full px-6 pt-20">
        <Outlet />
      </main>
    </div>
  );
}

export default function ModuleSelectLayoutWrapper() {
  return (
    <PrivateRoute>
      <ModuleSelectLayout />
    </PrivateRoute>
  );
}
