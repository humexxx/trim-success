import { useMemo } from "react";

import { EAmountType } from "@shared/enums";
import { IScorecardData } from "@shared/models";
import { formatAmount } from "@shared/utils";

import { MetricBarChart } from "./MetricBarChart";

interface Props {
  scorecard: IScorecardData;
  categories: string[];
  isExpanded: boolean;
}

const ICCGraph = ({ scorecard, categories, isExpanded }: Props) => {
  const dataset = useMemo(
    () => [
      ...categories.map((category) => ({
        category,
        value:
          Number(scorecard.inventoryCosts.totals[category]) +
          Number(scorecard.storingCosts.totals[category]),
      })),
      {
        category: "Total",
        value:
          Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total),
      },
    ],
    [categories, scorecard.inventoryCosts.totals, scorecard.storingCosts.totals]
  );

  return (
    <MetricBarChart
      dataset={dataset}
      label="Inventory Carry Cost (ICC)"
      chartColor={2}
      formatValue={(v) => formatAmount(v, EAmountType.MILLIS)}
      isExpanded={isExpanded}
    />
  );
};

export default ICCGraph;
