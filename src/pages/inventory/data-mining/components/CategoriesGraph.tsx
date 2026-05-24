import { useMemo } from "react";

import { IBaseData, IDriver } from "@shared/models";
import { formatAmount, formatPercentage } from "@shared/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: IBaseData["categoriesData"];
  drivers: IDriver[];
}

// Drivers in the multi-series bar chart use the shared palette tokens
// so the two series read as distinct but harmonious.
const DRIVER_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
];

const CategoriesGraph = ({ data, drivers }: Props) => {
  const sortedRows = useMemo(
    () => [...data.rows].sort((a, b) => a.category.localeCompare(b.category)),
    [data.rows]
  );

  const barSeries = useMemo(
    () => drivers.filter((x) => x.key === "GROSS_MARGIN" || x.key === "SALES"),
    [drivers]
  );

  const barData = useMemo(
    () =>
      sortedRows.map((row) => {
        const out: Record<string, number | string> = { category: row.category };
        barSeries.forEach((driver) => {
          out[driver.key] = Number(row[driver.key]);
        });
        return out;
      }),
    [sortedRows, barSeries]
  );

  const skuTotal = Number(data.totals.SKUS ?? 0) || 1;
  const pieData = useMemo(
    () =>
      sortedRows.map((row) => ({
        name: row.category,
        value: Number(row.SKUS),
      })),
    [sortedRows]
  );

  const barConfig: ChartConfig = useMemo(
    () =>
      barSeries.reduce<ChartConfig>((acc, driver, idx) => {
        acc[driver.key] = {
          label: driver.label,
          color: DRIVER_COLORS[idx % DRIVER_COLORS.length],
        };
        return acc;
      }, {}),
    [barSeries]
  );

  // Donut slices key off the SAME category→color map used elsewhere
  // (sales bar chart, inventory dashboard, portfolio radar), so a
  // category keeps its identity wherever it appears.
  const allCategories = useMemo(
    () => sortedRows.map((r) => r.category),
    [sortedRows]
  );

  const pieConfig: ChartConfig = useMemo(
    () =>
      pieData.reduce<ChartConfig>((acc, p) => {
        acc[p.name] = {
          label: p.name,
          color: colorForCategory(p.name, allCategories),
        };
        return acc;
      }, {}),
    [pieData, allCategories]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ventas y margen por categoría</CardTitle>
          <CardDescription className="text-xs">
            Comparación de ventas totales contra el margen bruto.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-0">
          <ChartContainer
            config={barConfig}
            className="aspect-auto h-[280px] w-full sm:h-[380px]"
          >
            <BarChart
              data={barData}
              margin={{ top: 16, right: 12, bottom: 24, left: 12 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => formatAmount(v as number)}
                width={64}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => formatAmount(v)}
                    indicator="dot"
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                content={<ChartLegendContent />}
              />
              {barSeries.map((driver) => (
                <Bar
                  key={driver.key}
                  dataKey={driver.key}
                  name={driver.label}
                  fill={`var(--color-${driver.key})`}
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SKUs por categoría</CardTitle>
          <CardDescription className="text-xs">
            Distribución del catálogo activo entre categorías.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-0">
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square h-[280px] sm:h-[380px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    valueFormatter={(v) =>
                      `${v.toLocaleString("en-US")} (${formatPercentage(v / skuTotal)})`
                    }
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={3}
                strokeWidth={2}
              >
                {pieData.map((slice) => (
                  <Cell
                    key={slice.name}
                    fill={colorForCategory(slice.name, allCategories)}
                    fillOpacity={0.85}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesGraph;
