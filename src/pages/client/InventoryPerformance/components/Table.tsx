import { useMemo } from "react";

import { GridColDef } from "@mui/x-data-grid";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import {
  IInventoryPerformanceData,
  IIventoryPerformanceMetric,
} from "@shared/models";
import { formatValue, roundToDecimals } from "@shared/utils";
import { StripedDataGrid } from "src/components";

interface Props {
  data: IInventoryPerformanceData;
  categories: string[];
}

function colValueFormatter(value: number, row: IIventoryPerformanceMetric) {
  switch (row.key) {
    case EInventoryPerformaceMetricType.ROTACION:
    case EInventoryPerformaceMetricType.INVENTORY_MONTHLY:
      return formatValue(roundToDecimals(value, 1), row.valueType);
    case EInventoryPerformaceMetricType.INVENTORY_360:
      return formatValue(roundToDecimals(value, 0), row.valueType);
    default:
      return formatValue(value, row.valueType);
  }
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
            valueFormatter: colValueFormatter,
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costo Totales",
        width: 150,
        valueFormatter: colValueFormatter,
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
