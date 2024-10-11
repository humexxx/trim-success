import { useMemo } from "react";

import { GridColDef } from "@mui/x-data-grid";
import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";
import { StripedDataGrid } from "src/components";

interface Props {
  data: IInventoryPerformanceData;
  categories: string[];
}

const Table = ({ data, categories }: Props) => {
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "label", headerName: "", flex: 1, minWidth: 150 },
      { field: "description", headerName: "", flex: 1, minWidth: 150 },
      ...categories.sort().map(
        (category) =>
          ({
            field: category,
            headerName: category,
            width: 200,
            valueFormatter: (value) => formatPercentage(value as number),
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costo Totales",
        width: 150,
        valueFormatter: (value) => formatPercentage(value as number),
      },
    ],
    [categories]
  );

  return (
    <StripedDataGrid
      getRowId={(row) => row.label}
      aria-label="Rendimiento de Inventario"
      columns={columns}
      rows={data.rows}
      disableColumnMenu
      hideFooter
    />
  );
};

export default Table;
