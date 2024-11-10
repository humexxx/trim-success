import { useMemo } from "react";

import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { EAmountType } from "@shared/enums";
import { IScorecardData } from "@shared/models";
import { formatAmount } from "@shared/utils";

const ICCGraph = ({
  scorecard,
  categories,
}: {
  scorecard: IScorecardData;
  categories: string[];
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
      height={350}
      leftAxis={{
        tickLabelStyle: {
          fontSize: 11,
          letterSpacing: 0.2,
        },
      }}
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
      margin={{ bottom: 85, left: 110 }}
    />
  );
};

export default ICCGraph;
