// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "src/context/auth";

function CubeLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/client/import" />;
  }

  return <Outlet />;
}

export default CubeLayout;
