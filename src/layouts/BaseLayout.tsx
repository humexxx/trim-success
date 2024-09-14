import { Alert } from "@mui/material";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalLoader } from "src/components";
import { useAuth } from "src/context/auth";
import { useCube } from "src/context/cube";
import { useDataParams } from "src/pages/client/GeneralData/hooks";

function BaseLayout() {
  const { data, loading, error } = useDataParams();
  const location = useLocation();

  const {
    dataParams: { setData },
    setHasInitialData,
  } = useCube();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (data) {
      setData(data);
      setHasInitialData(true);
    }
  }, [data, setData, setHasInitialData]);

  if (loading) {
    return <GlobalLoader />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return currentUser?.isAdmin ? (
      <Navigate to="/client/admin-import" />
    ) : (
      <Navigate to="/client/import" />
    );
  }

  if (location.pathname.includes("import"))
    return <Navigate to="/client/dashboard" />;

  return <Outlet />;
}

export default BaseLayout;
