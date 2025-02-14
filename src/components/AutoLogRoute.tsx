import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

interface AutoLogRouteProps {
  children: React.ReactElement;
}

const AutoLogRoute: React.FC<AutoLogRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to={ROUTES.MODULE_SELECTOR} replace />;
  }

  return children;
};

export default AutoLogRoute;
