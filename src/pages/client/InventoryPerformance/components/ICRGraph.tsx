import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

const ICRGraph = ({
  data,
  categories,
}: {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
}) => {
  const theme = useTheme();
  const dataset = useMemo(() => {
    return [
      ...categories.map((category) => {
        return {
          category,
          value: data[category] as number,
        };
      }),
      {
        category: "Total",
        value: data.total,
      },
    ];
  }, [data, categories]);

  return (
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "category",
          valueFormatter: (value, context) => {
            if (context.location === "tooltip") return value;
            return value.length > 15 ? value.slice(0, 15) + "..." : value;
          },
        },
      ]}
      yAxis={[{ valueFormatter: (value) => formatPercentage(value as number) }]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatPercentage(value as number),
          color: theme.palette.grey[400],
          label: "Inventory Carry Rate (ICR)",
        },
      ]}
      height={350}
      bottomAxis={{
        labelStyle: {
          fontSize: 14,
          transform: `translateY(${
            // Hack that should be added in the lib latter.
            5 * Math.abs(Math.sin((Math.PI * 45) / 180))
          }px)`,
        },
        tickLabelStyle: {
          angle: 45,
          textAnchor: "start",
          fontSize: 11,
          letterSpacing: 0.3,
        },
      }}
      margin={{ bottom: 85, left: 60 }}
    />
  );
};

export default ICRGraph;
