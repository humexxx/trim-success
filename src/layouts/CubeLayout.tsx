import { Navigate, Outlet } from "react-router-dom";
import { useCube } from "src/context/cube";

function CubeLayout() {
  const { fileResolution } = useCube();

  if (!fileResolution) {
    return <Navigate to="/client/import" />;
  }

  return <Outlet />;
}

export default CubeLayout;
