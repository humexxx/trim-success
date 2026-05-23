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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  data: IBaseData["categoriesData"];
  drivers: IDriver[];
}

// Categorical palette derived from the project's monochrome theme so the
// pie slices stay readable without pulling in a separate chart library
// palette dependency.
const PIE_COLORS = [
  "#0f172a",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div style={{ height: 460 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="category"
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tickFormatter={(v) => formatAmount(v as number)}
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value) => formatAmount(Number(value))}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {barSeries.map((driver, idx) => (
                  <Bar
                    key={driver.key}
                    dataKey={driver.key}
                    name={driver.label}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="relative" style={{ height: 460 }}>
            <h3 className="absolute left-0 right-0 top-2 text-center text-base font-semibold">
              Sku&apos;s
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={130}
                  paddingAngle={4}
                  label={({ value }) =>
                    formatPercentage((value as number) / skuTotal)
                  }
                >
                  {pieData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const n = Number(value);
                    return [
                      `${n} (${formatPercentage(n / skuTotal)})`,
                      item?.payload?.name,
                    ];
                  }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesGraph;
