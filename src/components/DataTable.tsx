import { ReactNode, useMemo, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
 * "totals row" and pagination) but drops MUI's grid-specific affordances
 * like resizable columns or virtualization — none of the call sites in
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
  /** Enable client-side pagination + page-size selector. */
  pagination?: {
    initialPageSize?: number;
    pageSizeOptions?: number[];
  };
}

export function DataTable<TData, TValue>({
  data,
  columns,
  totals,
  initialSorting,
  striped = true,
  className,
  emptyState,
  pagination,
}: DataTableProps<TData, TValue>) {
  const memoData = useMemo(() => data, [data]);
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);

  const table = useReactTable({
    data: memoData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize: pagination.initialPageSize ?? 20 } },
        }
      : {}),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-2">
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {visibleRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyState ?? "Sin datos"}
              </TableCell>
            </TableRow>
          ) : (
            visibleRows.map((row, idx) => (
              <TableRow
                key={row.id}
                className={cn(striped && idx % 2 === 1 && "bg-muted/40")}
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
                <TableCell
                  key={t.key}
                  className={cn("font-semibold", t.className)}
                >
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

      {pagination && (
        <div className="flex items-center justify-between gap-2 px-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Filas por página</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(pagination.pageSizeOptions ?? [10, 20, 50, 100]).map(
                  (size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount() || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Página siguiente"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
