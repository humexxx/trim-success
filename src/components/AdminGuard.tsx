import React, { PropsWithChildren } from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

function AdminGuard({ children }: PropsWithChildren) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to={ROUTES.MODULE_SELECTOR} />;
  }

  return children;
}

export default AdminGuard;
