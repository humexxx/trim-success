import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";

interface AutoLogRouteProps {
  children: React.ReactElement;
}

const AutoLogRoute: React.FC<AutoLogRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/client/dashboard" replace />;
  }

  return children;
};

export default AutoLogRoute;
