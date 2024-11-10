import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { EAmountType } from "@shared/enums";
import { IInventoryPerformanceData } from "@shared/models";
import { formatAmount } from "@shared/utils";

const InventoryValueAddedGraph = ({
  data,
  categories,
}: {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
}) => {
  const theme = useTheme();
  const dataset = useMemo(() => {
    return [
      {
        category: "Total",
        value: data.total,
      },
      ...categories.map((category) => {
        return {
          category,
          value: data[category] as number,
        };
      }),
    ];
  }, [data, categories]);

  return (
    <BarChart
      dataset={dataset}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "category",
          valueFormatter: (value, context) => {
            if (context.location === "tooltip") return value;
            return value.length > 15 ? value.slice(0, 15) + "..." : value;
          },
        },
      ]}
      xAxis={[
        {
          valueFormatter: (value) =>
            formatAmount(value as number, EAmountType.MILLIS),
        },
      ]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatAmount(value as number),
          color: theme.palette.primary.dark,
          label: "Iventory Value Added™ (IVA)",
        },
      ]}
      layout="horizontal"
      height={350}
      leftAxis={{
        tickLabelStyle: {
          fontSize: 11,
          letterSpacing: 0.2,
        },
      }}
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
      margin={{ bottom: 85, left: 110 }}
    />
  );
};

export default InventoryValueAddedGraph;
