import { useMemo } from "react";

import {
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
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
  /** Per-category values. Total row is rendered as a center label. */
  dataset: DatasetItem[];
  /** Visible series name (legend + tooltip). */
  label: string;
  /** chart-1..5 palette token. */
  chartColor: 1 | 2 | 3 | 4 | 5;
  /** Formatter for the value display (e.g. "12.3%"). */
  formatValue: (value: number) => string;
  /** When true, taller layout with bigger inner labels. */
  isExpanded: boolean;
}

/**
 * Radial bar variant for the same `{category, value}` dataset that
 * `MetricBarChart` accepts. Each category becomes a concentric arc;
 * the "Total" row (if present) is excluded from the rings and shown
 * as a centered numeric label so it doesn't dwarf the per-category
 * arcs.
 *
 * The palette token resolves through ChartContainer to
 * `var(--color-value)` exactly like the bar variant, so dark mode + the
 * shadcn palette tokens stay in charge of color.
 */
export function MetricRadialChart({
  dataset,
  label,
  chartColor,
  formatValue,
  isExpanded,
}: Props) {
  const { rings, total } = useMemo(() => {
    const totalRow = dataset.find((d) => d.category === "Total");
    const categoryRows = dataset.filter((d) => d.category !== "Total");
    const allCategories = categoryRows.map((d) => d.category);
    // Each ring picks up its category's canonical color, so a category
    // reads the same here as in any other chart on the page. Slight
    // transparency softens the stack visually.
    return {
      rings: categoryRows.map((d) => ({
        category: d.category,
        value: d.value,
        fill: colorForCategory(d.category, allCategories),
        fillOpacity: 0.85,
      })),
      total: totalRow ?? null,
    };
  }, [dataset]);

  const config: ChartConfig = {
    value: {
      label,
      color: `hsl(var(--chart-${chartColor}))`,
    },
  };

  const height = isExpanded ? 600 : 320;

  return (
    <ChartContainer
      config={config}
      className="relative aspect-auto w-full"
      style={{ height }}
    >
      <RadialBarChart
        data={rings}
        innerRadius={isExpanded ? "30%" : "35%"}
        outerRadius="95%"
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid
          gridType="circle"
          stroke="hsl(var(--border))"
          strokeOpacity={0.5}
        />
        <PolarAngleAxis type="number" domain={[0, "dataMax"]} tick={false} />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const p = payload?.[0] as
                  | { payload?: { category?: string } }
                  | undefined;
                return p?.payload?.category ?? _;
              }}
              valueFormatter={(value) => formatValue(value)}
              indicator="dot"
            />
          }
        />
        <RadialBar
          dataKey="value"
          background={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          cornerRadius={8}
        />
      </RadialBarChart>

      {/* Centered total label — sits on top of the chart's empty
          center hole, anchored absolutely so it doesn't fight the
          radial bar layout. */}
      {total && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Total
          </span>
          <span className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatValue(total.value)}
          </span>
        </div>
      )}
    </ChartContainer>
  );
}
