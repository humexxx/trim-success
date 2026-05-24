import { useMemo } from "react";

import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import {
  IInventoryPerformanceData,
  IIventoryPerformanceMetric,
} from "@shared/models";
import { formatValue, roundToDecimals } from "@shared/utils";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";

interface Props {
  data: IInventoryPerformanceData;
  categories: string[];
}

function formatCell(value: number, row: IIventoryPerformanceMetric) {
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
  const columns = useMemo<ColumnDef<IIventoryPerformanceMetric>[]>(
    () => [
      { accessorKey: "label", header: "" },
      { accessorKey: "description", header: "" },
      ...[...categories].sort().map<ColumnDef<IIventoryPerformanceMetric>>(
        (category) => ({
          accessorKey: category,
          header: category,
          cell: ({ getValue, row }) =>
            formatCell(getValue() as number, row.original),
        })
      ),
      {
        accessorKey: "total",
        header: "Costo Totales",
        cell: ({ getValue, row }) =>
          formatCell(getValue() as number, row.original),
      },
    ],
    [categories]
  );

  return <DataTable data={data.rows} columns={columns} />;
};

export default Table;
