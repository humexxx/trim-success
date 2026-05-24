import { useMemo } from "react";

import { IScorecardData } from "@shared/models";
import { formatAmount } from "@shared/utils";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  data?: IScorecardData;
  categories: string[];
  loading: boolean;
}

/**
 * Display-only grand-total row showing the combined Storing + Inventory
 * cost per category. The previous version implemented this via a
 * TotalGrid header-only DataGrid; here it's a simple two-row table where
 * the header row carries the formatted totals.
 */
const GrandTotalGrid = ({ data, categories, loading }: Props) => {
  const sortedCategories = useMemo(() => [...categories].sort(), [categories]);

  const totalByCategory = useMemo(() => {
    const out: Record<string, number> = {};
    sortedCategories.forEach((c) => {
      out[c] =
        Number(data?.inventoryCosts.totals[c] ?? 0) +
        Number(data?.storingCosts.totals[c] ?? 0);
    });
    return out;
  }, [sortedCategories, data]);

  const grandTotal =
    Number(data?.inventoryCosts.totals.total ?? 0) +
    Number(data?.storingCosts.totals.total ?? 0);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">
              Costo de Mantener el Inventario (ICC)
            </TableHead>
            <TableHead />
            {sortedCategories.map((c) => (
              <TableHead key={c} className="text-right font-semibold">
                {formatAmount(totalByCategory[c])}
              </TableHead>
            ))}
            <TableHead className="text-right font-semibold">
              {formatAmount(grandTotal)}
            </TableHead>
            <TableHead />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={sortedCategories.length + 4} />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default GrandTotalGrid;
