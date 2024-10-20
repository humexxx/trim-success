import { useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { useAuth } from "src/context/hooks";
import { CubeProvider } from "src/context/cube";
import { ThemeProvider } from "src/context/theme";

import { BaseLayout } from "./BaseLayout";

export default function ClientLayout() {
  const navigate = useNavigate();
  const { isAdmin, customUser } = useAuth();

  const onCubeLoadError = useCallback(() => {
    if (isAdmin && !customUser?.uid)
      navigate("/client/impersonate", { replace: true });
    else navigate("/client/import", { replace: true });
  }, [customUser?.uid, isAdmin, navigate]);

  return (
    <PrivateRoute>
      <ThemeProvider>
        <CubeProvider onCubeLoadError={onCubeLoadError}>
          <BaseLayout />
        </CubeProvider>
      </ThemeProvider>
    </PrivateRoute>
  );
}
