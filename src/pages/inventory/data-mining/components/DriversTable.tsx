import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { IBaseData } from "@shared/models";

import { DataTable } from "@/components/DataTable";

type Row = IBaseData["driversData"]["rows"][number];

interface Props {
  data?: IBaseData["driversData"];
  categories: string[];
}

const DriversTable = ({ data, categories }: Props) => {
  const rows = useMemo(() => data?.rows ?? [], [data]);

  const columns = useMemo<ColumnDef<Row>[]>(() => {
    return [
      {
        accessorKey: "driver",
        header: "Driver",
        cell: ({ getValue }) => `% ${getValue() as string}`,
      },
      ...[...categories]
        .sort()
        .map<ColumnDef<Row>>((category) => ({
          accessorKey: category,
          header: category,
          cell: ({ getValue }) => {
            const raw = getValue() as number | undefined;
            if (raw == null) return "-";
            return `${Math.round(raw * 100)}%`;
          },
        })),
    ];
  }, [categories]);

  return <DataTable data={rows} columns={columns} />;
};

export default DriversTable;
