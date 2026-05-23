import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { IBaseData, IDriver } from "@shared/models";
import { formatAmount } from "@shared/utils";

import { DataTable, DataTableTotalCell } from "@/components/DataTable";

type Row = IBaseData["categoriesData"]["rows"][number];

interface Props {
  data?: IBaseData["categoriesData"];
  drivers: IDriver[];
}

const CategoriesTable = ({ data, drivers }: Props) => {
  const rows = useMemo(() => data?.rows ?? [], [data]);

  const columns = useMemo<ColumnDef<Row>[]>(() => {
    return [
      {
        accessorKey: "category",
        header: "Rotulos de fila",
      },
      ...drivers
        .filter((x) => !x.xcatHidden)
        .map<ColumnDef<Row>>((driver, index) => ({
          accessorKey: driver.key,
          header: `${index === 0 ? "Count of" : "Sum of"} ${driver.label}`,
          cell: ({ getValue }) => {
            const raw = getValue() as number | undefined;
            if (raw == null) return "-";
            return index === 0 ? String(raw) : formatAmount(raw);
          },
        })),
    ];
  }, [drivers]);

  const totals = useMemo<DataTableTotalCell<Row>[]>(() => {
    const out: DataTableTotalCell<Row>[] = [
      {
        key: "label",
        value: () => "Totales",
      },
    ];
    drivers
      .filter((x) => x.columnIndexReference !== -1)
      .forEach((driver) => {
        out.push({
          key: driver.key,
          value: (allRows) =>
            formatAmount(
              allRows.reduce(
                (acc, row) => acc + ((row[driver.key] as number) ?? 0),
                0
              )
            ),
        });
      });
    return out;
  }, [drivers]);

  return (
    <DataTable
      data={rows}
      columns={columns}
      totals={totals}
      initialSorting={[{ id: "category", desc: false }]}
    />
  );
};

export default CategoriesTable;
