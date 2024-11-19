import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

import { defaultGraphProps } from "./utils";

const ICCvsSalesGraph = ({
  data,
  categories,
  isExpanded,
}: {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
  isExpanded: boolean;
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
            return isExpanded
              ? value.replace(/ /g, " \n")
              : value.length > 15
                ? value.slice(0, 15) + "..."
                : value;
          },
        },
      ]}
      yAxis={[{ valueFormatter: (value) => formatPercentage(value as number) }]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatPercentage(value as number),
          color: theme.palette.grey[800],
          label: "Inventory Carrying Cost vs. Sales",
        },
      ]}
      {...defaultGraphProps(isExpanded)}
    />
  );
};

export default ICCvsSalesGraph;
