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
      ...categories.map((category) => {
        return {
          category,
          value:
            Number(scorecard.inventoryCosts.totals[category]) +
            Number(scorecard.storingCosts.totals[category]),
        };
      }),
      {
        category: "Total",
        value:
          Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total),
      },
    ];
  }, [
    categories,
    scorecard.inventoryCosts.totals,
    scorecard.storingCosts.totals,
  ]);

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
      {...defaultGraphProps(isExpanded)}
    />
  );
};

export default ICCGraph;
