import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/auth";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser?.isAdmin) {
    return <Navigate to="/client/dashboard" />;
  }

  return children;
};

export default AdminRoute;
