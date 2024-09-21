import { Box, Typography } from "@mui/material";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";

const Page = () => {
  useDocumentMetadata("Panel - Trim Success");
  const cube = useCube();

  return (
    <>
      <Typography variant="h5" component="h1" color="text.primary">
        {cube.fileResolution?.file?.name}
      </Typography>
      <Box mt={4}>
        <Typography variant="h6" component="h2" color="text.primary">
          Some information about the cube
        </Typography>
      </Box>
    </>
  );
};

export default Page;
