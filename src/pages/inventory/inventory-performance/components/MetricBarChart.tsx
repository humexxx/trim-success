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
   * Series color via the canonical shadcn chart palette token name
   * (1-5). The fill is wired through `var(--color-value)` which
   * ChartContainer generates from this config — keeps theme awareness
   * + dark-mode friendly contrast without per-chart overrides.
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
      })),
    [dataset, isExpanded]
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
        {/* shadcn area/bar chart gradient pattern: id is unique per
            chart instance via the chartColor token. */}
        <defs>
          <linearGradient
            id={`fillBar-${chartColor}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="var(--color-value)"
              stopOpacity={0.95}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)"
              stopOpacity={0.5}
            />
          </linearGradient>
        </defs>
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
          fill={`url(#fillBar-${chartColor})`}
          radius={[6, 6, 0, 0]}
          maxBarSize={68}
        >
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={
                d.isTotal
                  ? "hsl(var(--muted-foreground))"
                  : `url(#fillBar-${chartColor})`
              }
              fillOpacity={d.isTotal ? 0.55 : 1}
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
