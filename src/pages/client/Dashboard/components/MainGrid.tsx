import { Typography } from "@mui/material";
import StripedGrid from "src/components/StripedDataGrid";
import { useCube } from "src/context/cube";

const MainGrid = () => {
  const cube = useCube();

  return (
    <>
      <Typography color="text.primary" mt={2}>
        <strong>Cantidad de columnas:</strong> {cube.fileData?.columns?.length}
      </Typography>
      <Typography color="text.primary" mb={2}>
        <strong>Cantidad de filas:</strong> {cube.fileData?.rows?.length}
      </Typography>
      <StripedGrid
        rows={cube.fileData?.rows ?? []}
        columns={(cube.fileData?.columns as any) ?? []}
      />
    </>
  );
};

export default MainGrid;
