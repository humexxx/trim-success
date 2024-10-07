import { DataGrid, DataGridProps } from "@mui/x-data-grid";

const TotalGrid = (props: DataGridProps) => {
  return (
    <DataGrid
      {...props}
      hideFooter
      disableColumnMenu
      disableColumnFilter
      disableColumnSorting
      sx={{
        "& .bold *": { fontWeight: "bold" },
        "& .MuiDataGrid-overlay": { display: "none" },
        ...props.sx,
      }}
    />
  );
};

export default TotalGrid;
