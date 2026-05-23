import { useMemo, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { colorForCategory } from "src/lib/categoryColors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

// Seasonal multipliers — gives the line a believable Q4-heavy shape
// (Black Friday + holiday season) instead of a flat distribution.
const SEASONALITY = [0.07, 0.06, 0.08, 0.08, 0.08, 0.07, 0.07, 0.08, 0.09, 0.1, 0.11, 0.11];

interface CategoryYearTotal {
  category: string;
  sales: number;
}

interface Props {
  byCategory: CategoryYearTotal[];
}

/**
 * Interactive monthly sales trend (shadcn area-chart-interactive
 * pattern). The cube only stores annual aggregates per category, so
 * the per-month series is synthesized by distributing the yearly
 * total across the SEASONALITY curve. Stable per category — re-runs
 * never wiggle the bars — and labeled as "estimación" in the card
 * description so the synthetic source is explicit.
 */
export function MonthlyTrendChart({ byCategory }: Props) {
  const [range, setRange] = useState<"12m" | "6m" | "3m">("12m");

  const months = useMemo(() => {
    const slice =
      range === "3m" ? MONTHS.slice(-3) : range === "6m" ? MONTHS.slice(-6) : MONTHS;
    return slice;
  }, [range]);
  const monthOffset = MONTHS.length - months.length;

  const sortedCategories = useMemo(
    () => [...byCategory].sort((a, b) => b.sales - a.sales).slice(0, 4),
    [byCategory]
  );

  const data = useMemo(() => {
    return months.map((m, i) => {
      const monthIdx = monthOffset + i;
      const row: Record<string, number | string> = { month: m };
      sortedCategories.forEach((c) => {
        row[c.category] = Math.round(c.sales * SEASONALITY[monthIdx]!);
      });
      return row;
    });
  }, [months, monthOffset, sortedCategories]);

  // Use the shared category→color helper so categories show the same
  // tone here as on the inventory dashboard, donut, and bar charts.
  const allCategoryNames = useMemo(
    () => byCategory.map((c) => c.category),
    [byCategory]
  );

  const config: ChartConfig = useMemo(
    () =>
      sortedCategories.reduce<ChartConfig>((acc, c) => {
        acc[c.category] = {
          label: c.category,
          color: colorForCategory(c.category, allCategoryNames),
        };
        return acc;
      }, {}),
    [sortedCategories, allCategoryNames]
  );

  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const totalRange = data.reduce((acc, row) => {
    sortedCategories.forEach((c) => {
      acc += Number(row[c.category] ?? 0);
    });
    return acc;
  }, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-col gap-3 space-y-0 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Tendencia mensual de ventas</CardTitle>
          <CardDescription className="text-xs">
            Estimación mensual basada en la curva estacional del catálogo —
            total del rango {fmt.format(totalRange)}.
          </CardDescription>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          value={range}
          onValueChange={(v) => v && setRange(v as "12m" | "6m" | "3m")}
          className={cn(
            "rounded-md border bg-background p-0.5",
            "[&_button]:h-7 [&_button]:px-2.5 [&_button]:text-xs"
          )}
        >
          <ToggleGroupItem value="3m">3M</ToggleGroupItem>
          <ToggleGroupItem value="6m">6M</ToggleGroupItem>
          <ToggleGroupItem value="12m">12M</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex-1 px-2 pb-4 pt-4 sm:px-6">
        <ChartContainer config={config} className="aspect-auto h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
            <defs>
              {/* One gradient per category — keyed off the category name
                  so the gradient id is stable + the color comes from
                  the shared category palette. */}
              {sortedCategories.map((c) => {
                const color = colorForCategory(c.category, allCategoryNames);
                const id = `fillArea-${c.category.replace(/\s+/g, "-")}`;
                return (
                  <linearGradient
                    key={c.category}
                    id={id}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.85} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.15} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={56}
              tickFormatter={(v) => fmt.format(v as number)}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "3 3" }}
              content={
                <ChartTooltipContent
                  valueFormatter={(v) => fmt.format(v)}
                  indicator="dot"
                />
              }
            />
            <Legend content={<ChartLegendContent />} />
            {sortedCategories.map((c) => {
              const color = colorForCategory(c.category, allCategoryNames);
              const id = `fillArea-${c.category.replace(/\s+/g, "-")}`;
              return (
                <Area
                  key={c.category}
                  dataKey={c.category}
                  type="natural"
                  fill={`url(#${id})`}
                  fillOpacity={1}
                  stroke={color}
                  strokeWidth={2}
                  stackId="stack"
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
