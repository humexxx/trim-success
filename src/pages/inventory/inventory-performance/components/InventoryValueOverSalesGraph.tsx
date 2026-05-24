import { useMemo } from "react";

import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

import { MetricBarChart } from "./MetricBarChart";

interface Props {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
  isExpanded: boolean;
}

const InventoryValueOverSalesGraph = ({
  data,
  categories,
  isExpanded,
}: Props) => {
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
      label="Inventory Value vs. Sales"
      chartColor={4}
      formatValue={(v) => formatPercentage(v)}
      isExpanded={isExpanded}
    />
  );
};

export default InventoryValueOverSalesGraph;
