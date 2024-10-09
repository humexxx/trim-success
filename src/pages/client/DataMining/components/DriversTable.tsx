import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { StripedDataGrid } from "src/components";
import { IBaseData } from "@shared/models";

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
        minWidth: 150,
        flex: 1,
      },
      ...categories.sort().map((category) => {
        return {
          field: category,
          type: "number",
          width: 150,
          valueFormatter: (value) => `${Math.round(value * 100)}%`,
        } as GridColDef;
      }),
    ];
    return columns;
  }, [categories]);

  return (
    <StripedDataGrid
      getRowId={(row) => row.driver}
      aria-label="Drivers table"
      columns={columns}
      rows={data?.rows ?? []}
    />
  );
};

export default DriversTable;
