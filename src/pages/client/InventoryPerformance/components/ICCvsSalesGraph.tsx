import { useMemo } from "react";

import { BarChart } from "@mui/x-charts";
import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

const ICCvsSalesGraph = ({
  data,
  categories,
}: {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
}) => {
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
      xAxis={[{ scaleType: "band", dataKey: "category" }]}
      yAxis={[{ valueFormatter: (value) => formatPercentage(value as number) }]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatPercentage(value as number),
          color: "#777",
          label: "Inventory Carrying Cost vs Sales",
        },
      ]}
      width={500}
      height={300}
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
      margin={{ bottom: 80, left: 60 }}
    />
  );
};

export default ICCvsSalesGraph;
