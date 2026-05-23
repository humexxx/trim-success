import { useMemo } from "react";

import { IInventoryPerformanceData } from "@shared/models";
import { formatPercentage } from "@shared/utils";

import { MetricRadialChart } from "./MetricRadialChart";

interface Props {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
  isExpanded: boolean;
}

const ICCvsSalesGraph = ({ data, categories, isExpanded }: Props) => {
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
    // Another % metric → radial reads better than bar for this kind of
    // ratio (matches ICR's treatment for visual consistency between
    // the two percentage cards).
    <MetricRadialChart
      dataset={dataset}
      label="Inventory Carrying Cost vs. Sales"
      chartColor={3}
      formatValue={(v) => formatPercentage(v)}
      isExpanded={isExpanded}
    />
  );
};

export default ICCvsSalesGraph;
