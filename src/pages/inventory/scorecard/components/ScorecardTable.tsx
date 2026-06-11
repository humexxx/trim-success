import { useEffect, useMemo, useState } from "react";

import {
  IDriver,
  IParameter,
  IScorecardCostBlock,
  IScorecardCostRow,
} from "@shared/models";
import { formatAmount, formatPercentage } from "@shared/utils";
import { Loader2 } from "lucide-react";

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

interface Props {
  /** First column header — names the cost block (e.g. "Warehousing Costs"). */
  title: string;
  /** Label of the totals row in the footer. */
  footerLabel: string;
  data?: IScorecardCostBlock;
  categories: string[];
  investmentTypes: IParameter[];
  updateRow: (row: IScorecardCostRow) => Promise<void>;
  drivers: IDriver[];
  loading: boolean;
}

/**
 * Inline-editable replacement for the previous MUI x-data-grid scorecard
 * table. driver + invest cells render a shadcn Select that fires updateRow
 * on change (mirrors the original processRowUpdate behavior). Numeric
 * category/total/percentage columns are read-only. Shared by both cost
 * blocks (warehousing + inventory) — they only differ in labels.
 */
const ScorecardTable = ({
  title,
  footerLabel,
  data,
  categories,
  investmentTypes,
  updateRow,
  drivers,
  loading,
}: Props) => {
  const [rows, setRows] = useState<IScorecardCostRow[]>(data?.rows ?? []);
  const sortedCategories = useMemo(() => [...categories].sort(), [categories]);

  useEffect(() => {
    setRows(data?.rows ?? []);
  }, [data]);

  const handleDriverChange = async (
    row: IScorecardCostRow,
    driverKey: string
  ) => {
    const next = { ...row, driver: driverKey };
    setRows((prev) => prev.map((r) => (r.cost === row.cost ? next : r)));
    await updateRow(next);
  };

  const handleInvestChange = async (
    row: IScorecardCostRow,
    investName: string
  ) => {
    const next = { ...row, invest: investName };
    setRows((prev) => prev.map((r) => (r.cost === row.cost ? next : r)));
    await updateRow(next);
  };

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
            <TableHead>{title}</TableHead>
            <TableHead>Driver</TableHead>
            {sortedCategories.map((c) => (
              <TableHead key={c} className="text-right">
                {c}
              </TableHead>
            ))}
            <TableHead className="text-right">Costos Totales</TableHead>
            <TableHead className="text-right">% Cost</TableHead>
            <TableHead>% Investment Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => {
            const hasInvest = "invest" in row;
            return (
              <TableRow
                key={row.cost}
                className={cn(idx % 2 === 1 && "bg-muted/40")}
              >
                <TableCell>{row.cost}</TableCell>
                <TableCell>
                  <Select
                    value={row.driver}
                    onValueChange={(v) => handleDriverChange(row, v)}
                  >
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Seleccionar">
                        {drivers.find((d) => d.key === row.driver)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.key} value={d.key}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {sortedCategories.map((c) => (
                  <TableCell key={c} className="text-right tabular-nums">
                    {formatAmount(Number(row[c] ?? 0))}
                  </TableCell>
                ))}
                <TableCell className="text-right tabular-nums">
                  {formatAmount(Number(row.total))}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPercentage(Number(row.totalPercentage))}
                </TableCell>
                <TableCell>
                  {hasInvest ? (
                    <Select
                      value={row.invest ?? ""}
                      onValueChange={(v) => handleInvestChange(row, v)}
                    >
                      <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue placeholder="n/a">
                          {(() => {
                            const it = investmentTypes.find(
                              (t) => t.name === row.invest
                            );
                            return it
                              ? formatPercentage(it.value / 100)
                              : "n/a";
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.name} ({formatPercentage(t.value / 100)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">{footerLabel}</TableCell>
            <TableCell />
            {sortedCategories.map((c) => (
              <TableCell
                key={c}
                className="text-right font-semibold tabular-nums"
              >
                {formatAmount(Number(data?.totals[c] ?? 0))}
              </TableCell>
            ))}
            <TableCell className="text-right font-semibold tabular-nums">
              {formatAmount(Number(data?.totals.total ?? 0))}
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {formatPercentage(Number(data?.totals.totalPercentage ?? 0))}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ScorecardTable;
