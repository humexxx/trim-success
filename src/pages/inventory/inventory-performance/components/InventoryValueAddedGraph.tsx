import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { EAmountType } from "@shared/enums";
import { IInventoryPerformanceData } from "@shared/models";
import { formatAmount } from "@shared/utils";

import { defaultGraphProps } from "./utils";

const InventoryValueAddedGraph = ({
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
            return value.length > 15 ? value.slice(0, 15) + "..." : value;
          },
        },
      ]}
      yAxis={[
        {
          valueFormatter: (value) =>
            formatAmount(value as number, EAmountType.MILLIS),
          tickLabelInterval: (value, index) =>
            index % (isExpanded ? 2 : 1) === 0,
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
      {...defaultGraphProps(isExpanded)}
    />
  );
};

export default InventoryValueAddedGraph;
