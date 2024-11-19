import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { EAmountType } from "@shared/enums";
import { IScorecardData } from "@shared/models";
import { formatAmount } from "@shared/utils";

import { defaultGraphProps } from "./utils";

const ICCGraph = ({
  scorecard,
  categories,
  isExpanded,
}: {
  scorecard: IScorecardData;
  categories: string[];
  isExpanded: boolean;
}) => {
  const theme = useTheme();
  const dataset = useMemo(() => {
    return [
      {
        category: "Total",
        value:
          Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total),
      },
      ...categories.map((category) => {
        return {
          category,
          value:
            Number(scorecard.inventoryCosts.totals[category]) +
            Number(scorecard.storingCosts.totals[category]),
        };
      }),
    ];
  }, [
    categories,
    scorecard.inventoryCosts.totals,
    scorecard.storingCosts.totals,
  ]);

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
          tickLabelInterval: (_, index) => index % (isExpanded ? 2 : 1) === 0,
        },
      ]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatAmount(value as number),
          color: theme.palette.error.dark,
          label: "Inventory Carry Cost (ICC)",
        },
      ]}
      layout="horizontal"
      {...defaultGraphProps(isExpanded, { hasLongLeftLabels: true })}
    />
  );
};

export default ICCGraph;
