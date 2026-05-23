import { Outlet } from "react-router-dom";
import { PageTransition, PrivateRoute } from "src/components";

import { Header } from "./_components";

function ModuleSelectLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Header hasDrawer={false} />
      <main className="w-full px-6 pt-20">
        <PageTransition>
          <Outlet />
        </PageTransition>
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
