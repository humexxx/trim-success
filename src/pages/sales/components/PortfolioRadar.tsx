import { useMemo } from "react";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
import { Legend } from "recharts";

interface CategoryPortfolio {
  category: string;
  sales: number;
  cost: number;
  grossMargin: number;
  skus: number;
}

interface Props {
  byCategory: CategoryPortfolio[];
}

/**
 * Radar chart comparing the relative shape of each category along five
 * normalized axes. Every metric is scaled to its own max across the
 * dataset (0..100) so the polygons are visually comparable even when
 * the absolute values are wildly different (Sales is millions, SKUs
 * is hundreds). Useful for spotting category personalities — e.g. a
 * category that's high-margin but low-volume is shaped very
 * differently from a high-volume low-margin one.
 */
export function PortfolioRadar({ byCategory }: Props) {
  const ranked = useMemo(
    () =>
      [...byCategory]
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4)
        .map((c) => ({
          ...c,
          marginPct: c.sales > 0 ? c.grossMargin / c.sales : 0,
        })),
    [byCategory]
  );

  // Per-axis max for normalization.
  const max = useMemo(
    () => ({
      sales: Math.max(...ranked.map((c) => c.sales)) || 1,
      cost: Math.max(...ranked.map((c) => c.cost)) || 1,
      grossMargin: Math.max(...ranked.map((c) => c.grossMargin)) || 1,
      skus: Math.max(...ranked.map((c) => c.skus)) || 1,
      marginPct: Math.max(...ranked.map((c) => c.marginPct)) || 1,
    }),
    [ranked]
  );

  // Recharts radar expects one row per axis with one column per series.
  const data = useMemo(() => {
    const axes: { key: keyof typeof max; label: string }[] = [
      { key: "sales", label: "Ventas" },
      { key: "grossMargin", label: "Margen $" },
      { key: "marginPct", label: "Margen %" },
      { key: "skus", label: "SKUs" },
      { key: "cost", label: "Costo" },
    ];
    return axes.map((a) => {
      const row: Record<string, number | string> = { metric: a.label };
      ranked.forEach((c) => {
        row[c.category] = Math.round((c[a.key] / max[a.key]) * 100);
      });
      return row;
    });
  }, [ranked, max]);

  // Share the same category→color map used by the rest of the app —
  // a category's radar polygon picks up the exact same hue as its
  // bar, donut slice, area, etc.
  const allCategoryNames = useMemo(
    () => byCategory.map((c) => c.category),
    [byCategory]
  );

  const config: ChartConfig = useMemo(
    () =>
      ranked.reduce<ChartConfig>((acc, c) => {
        acc[c.category] = {
          label: c.category,
          color: colorForCategory(c.category, allCategoryNames),
        };
        return acc;
      }, {}),
    [ranked, allCategoryNames]
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Portafolio por categoría</CardTitle>
        <CardDescription className="text-xs">
          Cada eje está normalizado a su propio máximo — compara la forma del
          polígono, no el tamaño absoluto.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-2 pb-4 pt-4 sm:px-6">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[340px] w-full"
        >
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid
              gridType="polygon"
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  valueFormatter={(v) => `${v} / 100`}
                />
              }
            />
            <Legend content={<ChartLegendContent />} />
            {ranked.map((c) => {
              const color = colorForCategory(c.category, allCategoryNames);
              return (
                <Radar
                  key={c.category}
                  name={c.category}
                  dataKey={c.category}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              );
            })}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
