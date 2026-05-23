import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DatasetItem {
  category: string;
  value: number;
}

interface Props {
  /** Per-category values + a final "Total" row appended by the caller. */
  dataset: DatasetItem[];
  /** Visible series name (legend + tooltip). */
  label: string;
  /** Bar fill color (any CSS color). */
  color: string;
  /** Format a numeric value into the user-facing string (e.g. `$1.2M`). */
  formatValue: (value: number) => string;
  /** When true, taller chart + horizontal x labels. */
  isExpanded: boolean;
}

/**
 * Recharts replacement for the BarChart pattern that ICRGraph/ICCGraph/
 * ICCvsSalesGraph/InventoryValueAddedGraph/InventoryValueOverSalesGraph
 * shared on @mui/x-charts. Truncates long category labels when collapsed
 * to keep the axis readable.
 */
export function MetricBarChart({
  dataset,
  label,
  color,
  formatValue,
  isExpanded,
}: Props) {
  const data = useMemo(
    () =>
      dataset.map(({ category, value }) => ({
        category:
          !isExpanded && category.length > 15
            ? `${category.slice(0, 15)}…`
            : category,
        value,
        rawCategory: category,
      })),
    [dataset, isExpanded]
  );

  return (
    <div style={{ height: isExpanded ? 600 : 350, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 24, bottom: 64, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="category"
            angle={isExpanded ? 0 : -35}
            textAnchor={isExpanded ? "middle" : "end"}
            fontSize={isExpanded ? 13 : 11}
            interval={0}
            stroke="hsl(var(--muted-foreground))"
            height={isExpanded ? 60 : 80}
          />
          <YAxis
            tickFormatter={formatValue}
            fontSize={11}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            formatter={(value) => [formatValue(Number(value)), label]}
            labelFormatter={(_label, payload) =>
              payload?.[0]?.payload?.rawCategory ?? _label
            }
            contentStyle={{
              background: "hsl(var(--popover))",
              borderColor: "hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" name={label} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
