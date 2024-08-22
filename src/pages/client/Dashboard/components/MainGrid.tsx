import { DataGrid } from "@mui/x-data-grid";
import { useCube } from "src/context/cube";

const MainGrid = () => {
  const cube = useCube();

  return (
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
  );
};

export default MainGrid;
