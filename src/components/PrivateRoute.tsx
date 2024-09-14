import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/auth";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default PrivateRoute;
