import { useMemo } from "react";

import { EAmountType } from "@shared/enums";
import { IInventoryPerformanceData } from "@shared/models";
import { formatAmount } from "@shared/utils";

import { MetricBarChart } from "./MetricBarChart";

interface Props {
  data: IInventoryPerformanceData["rows"][0];
  categories: string[];
  isExpanded: boolean;
}

const InventoryValueAddedGraph = ({ data, categories, isExpanded }: Props) => {
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
      label="Inventory Value Added™ (IVA)"
      color="#0f172a"
      formatValue={(v) => formatAmount(v, EAmountType.MILLIS)}
      isExpanded={isExpanded}
    />
  );
};

export default InventoryValueAddedGraph;
