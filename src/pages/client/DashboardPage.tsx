import { Typography } from "@mui/material";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";

const DashboardPage = () => {
  useDocumentMetadata("Panel - Trim Success");
  const cube = useCube();
  return (
    <>
      <Typography color="text.primary">
        {cube.fileResolution?.file?.name}
      </Typography>
    </>
  );
};

export default DashboardPage;
