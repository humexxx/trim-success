import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { IBaseData } from "src/models";

interface Props {
  data?: IBaseData["driversData"];
  categories: string[];
}

const DriversTable = ({ data, categories }: Props) => {
  const columns: GridColDef[] = useMemo(() => {
    const columns: GridColDef[] = [
      {
        field: "driver",
        headerName: "Driver",
        valueFormatter: (value) => `% ${value}`,
        width: 175,
      },
      ...categories.sort().map((category) => {
        return {
          field: category,
          type: "number",
          width: 175,
          valueFormatter: (value) => `${Math.round(value * 100)}%`,
        } as GridColDef;
      }),
    ];
    return columns;
  }, [categories]);

  return (
    <DataGrid
      getRowId={(row) => row.driver}
      aria-label="CAT Table"
      columns={columns}
      rows={data?.rows ?? []}
      hideFooter
      disableAutosize
      disableColumnMenu
      disableColumnResize
      disableColumnSelector
      disableRowSelectionOnClick
      density="compact"
    />
  );
};

export default DriversTable;
