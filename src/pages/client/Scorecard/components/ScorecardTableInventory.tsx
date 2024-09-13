import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { IScorecardData } from "src/models/user";
import { formatCurrency, formatPercentage } from "src/utils";

interface Props {
  data?: IScorecardData["inventoryCosts"];
  categories: string[];
}

const ScorecardTableInventory = ({ data, categories }: Props) => {
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "cost", headerName: "Costos del Inventario", width: 150 },
      { field: "driver", headerName: "Driver", width: 150 },
      ...categories.sort().map(
        (category) =>
          ({
            field: category,
            headerName: category,
            width: 150,
            valueFormatter: formatCurrency,
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costos Totales",
        width: 150,
        valueFormatter: formatCurrency,
      },
      {
        field: "totalPercentage",
        headerName: "% Cost",
        width: 150,
        valueFormatter: formatPercentage,
      },
      {
        field: "invest",
        headerName: "Investment Type",
        width: 150,
      },
    ],
    [categories]
  );

  return (
    <DataGrid
      getRowId={(row) => row.cost}
      aria-label="Costos del Inventario"
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

export default ScorecardTableInventory;
