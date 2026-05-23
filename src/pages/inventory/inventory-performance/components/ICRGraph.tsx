import { useMemo } from "react";

import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

import { MetricRadialChart } from "./MetricRadialChart";

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
    // ICR is a rate — radial reads more like a "gauge" than a bar,
    // which fits the % semantics better than a vertical bar chart.
    <MetricRadialChart
      dataset={dataset}
      label="Inventory Carry Rate (ICR)"
      chartColor={1}
      formatValue={(v) => formatPercentage(v)}
      isExpanded={isExpanded}
    />
  );
};

export default ICRGraph;
