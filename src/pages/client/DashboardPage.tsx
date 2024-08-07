import { Typography } from "@mui/material";
import { useCube } from "src/context/cube";

const DashboardPage = () => {
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
