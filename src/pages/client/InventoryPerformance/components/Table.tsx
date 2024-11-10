import { useMemo } from "react";

import { GridColDef } from "@mui/x-data-grid";
import {
  IInventoryPerformanceData,
  IIventoryPerformanceMetric,
} from "@shared/models";
import { formatValue } from "@shared/utils";
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
            valueFormatter: (value, row: IIventoryPerformanceMetric) =>
              formatValue(value, row.valueType),
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costo Totales",
        width: 150,
        valueFormatter: (value, row: IIventoryPerformanceMetric) =>
          formatValue(value, row.valueType),
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
