import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { colorForCategory } from "src/lib/categoryColors";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DatasetItem {
  category: string;
  value: number;
}

interface Props {
  /** Per-category values + a final "Total" row appended by the caller. */
  dataset: DatasetItem[];
  /** Visible series name (legend + tooltip). */
  label: string;
  /**
   * Fallback color token when the chart is showing a single aggregate
   * series (e.g. "Ventas" on the Sales page, where the breakdown is
   * NOT per-category-of-interest). Per-category bars use
   * `colorForCategory` instead so a category keeps its identity across
   * the app.
   */
  chartColor: 1 | 2 | 3 | 4 | 5;
  /** Format a numeric value into the user-facing string (e.g. `$1.2M`). */
  formatValue: (value: number) => string;
  /** When true, taller chart + horizontal x labels + value labels on bars. */
  isExpanded: boolean;
}

/**
 * shadcn canonical bar chart wrapper. The series fill is driven by
 * `var(--color-value)` which ChartContainer injects from the config —
 * matches the bar-chart example at https://ui.shadcn.com/charts. The
 * synthetic "Total" bar uses the muted-foreground variable so the
 * aggregate visually separates from per-category bars.
 */
export function MetricBarChart({
  dataset,
  label,
  chartColor,
  formatValue,
  isExpanded,
}: Props) {
  // List of real categories (Total excluded) — the color helper needs
  // this to assign a stable shade per category across the whole app.
  const allCategories = useMemo(
    () => dataset.map((d) => d.category).filter((c) => c !== "Total"),
    [dataset]
  );

  const data = useMemo(
    () =>
      dataset.map(({ category, value }) => ({
        category:
          !isExpanded && category.length > 14
            ? `${category.slice(0, 13)}…`
            : category,
        value,
        rawCategory: category,
        isTotal: category === "Total",
        fill: colorForCategory(category, allCategories),
      })),
    [dataset, isExpanded, allCategories]
  );

  const config: ChartConfig = {
    value: {
      label,
      color: `hsl(var(--chart-${chartColor}))`,
    },
  };

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: isExpanded ? 600 : 320 }}
    >
      <BarChart
        data={data}
        margin={{ top: 24, right: 12, bottom: isExpanded ? 24 : 56, left: 12 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="hsl(var(--border))"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          angle={isExpanded ? 0 : -25}
          textAnchor={isExpanded ? "middle" : "end"}
          height={isExpanded ? 32 : 56}
          fontSize={11}
          interval={0}
        />
        <YAxis
          tickFormatter={(v) => formatValue(v as number)}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={56}
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const p = payload?.[0] as
                  | { payload?: { rawCategory?: string } }
                  | undefined;
                return p?.payload?.rawCategory ?? _;
              }}
              valueFormatter={(value) => formatValue(value)}
              indicator="dot"
            />
          }
        />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          maxBarSize={68}
        >
          {/* Per-category coloring: each Cell gets its category's
              canonical color (Total stays muted). Slight transparency
              keeps the chart feeling soft and modern. */}
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.fill}
              fillOpacity={d.isTotal ? 0.55 : 0.85}
            />
          ))}
          {isExpanded && (
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => formatValue(Number(value))}
              fill="hsl(var(--foreground))"
              fontSize={11}
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
