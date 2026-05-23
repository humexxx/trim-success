import { ReactNode, useMemo } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Replacement for src/components/StripedDataGrid (MUI x-data-grid).
 * Built on TanStack Table v8 + shadcn Table primitives.
 *
 * Keeps the visual contract (striped rows, compact density, optional
 * "totals row") but drops MUI's grid-specific affordances like
 * resizable columns or virtualization — none of the call sites in
 * this project relied on them.
 */

export interface DataTableTotalCell<TData> {
  key: string;
  label?: ReactNode;
  /** Computed value for the totals row (e.g. a Sum). */
  value: (rows: TData[]) => ReactNode;
  className?: string;
}

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  /** When provided, renders an extra totals row in <tfoot>. */
  totals?: DataTableTotalCell<TData>[];
  /** Initial sorting state. */
  initialSorting?: SortingState;
  /** Stripe rows for readability (default true). */
  striped?: boolean;
  /** Optional extra classes on the <table>. */
  className?: string;
  /** Render when there are no rows. */
  emptyState?: ReactNode;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  totals,
  initialSorting,
  striped = true,
  className,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const memoData = useMemo(() => data, [data]);
  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: initialSorting },
  });

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className={cn(header.column.columnDef.meta && "")}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyState ?? "Sin datos"}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row, idx) => (
            <TableRow
              key={row.id}
              className={cn(
                striped && idx % 2 === 1 && "bg-muted/40"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {totals && totals.length > 0 && (
        <TableFooter>
          <TableRow>
            {totals.map((t) => (
              <TableCell key={t.key} className={cn("font-semibold", t.className)}>
                {t.value(data)}
                {t.label && (
                  <span className="ml-1 text-muted-foreground">{t.label}</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
