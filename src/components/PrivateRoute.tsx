import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return children;
};

export default PrivateRoute;
