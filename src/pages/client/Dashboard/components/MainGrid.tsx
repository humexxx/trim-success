import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCube } from "src/context/cube";

const MainGrid = () => {
  const cube = useCube();

  return (
    <>
      <Typography color="text.primary" mt={2}>
        <strong>Cantidad de columnas:</strong>{" "}
        {cube.fileResolution?.columns?.length}
      </Typography>
      <Typography color="text.primary" mb={2}>
        <strong>Cantidad de filas:</strong> {cube.fileResolution?.rows?.length}
      </Typography>
      <DataGrid
        sx={{ fontSize: "0.75rem" }}
        loading={cube.loading}
        rows={cube.fileResolution?.rows ?? []}
        columns={cube.fileResolution?.columns ?? []}
        disableAutosize
        disableColumnSelector
        disableRowSelectionOnClick
        density="compact"
        autoHeight
      />
    </>
  );
};

export default MainGrid;
