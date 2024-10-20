import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/client/dashboard" />;
  }

  return children;
};

export default AdminRoute;
