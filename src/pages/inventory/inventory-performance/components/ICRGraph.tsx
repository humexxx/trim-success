import { useMemo } from "react";

import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

import { MetricBarChart } from "./MetricBarChart";

interface Props {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
  isExpanded: boolean;
}

const ICRGraph = ({ data, categories, isExpanded }: Props) => {
  const dataset = useMemo(
    () => [
      ...categories.map((category) => ({
        category,
        value: data[category] as number,
      })),
      { category: "Total", value: data.total },
    ],
    [data, categories]
  );

  return (
    <MetricBarChart
      dataset={dataset}
      label="Inventory Carry Rate (ICR)"
      chartColor={1}
      formatValue={(v) => formatPercentage(v)}
      isExpanded={isExpanded}
    />
  );
};

export default ICRGraph;
