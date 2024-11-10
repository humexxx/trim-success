import { useMemo } from "react";

import { BarChart } from "@mui/x-charts";
import { IScorecardData } from "@shared/models";
import { formatCurrency } from "@shared/utils";

const ICCGraph = ({
  scorecard,
  categories,
}: {
  scorecard: IScorecardData;
  categories: string[];
}) => {
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
      yAxis={[{ scaleType: "band", dataKey: "category" }]}
      xAxis={[{ valueFormatter: (value) => formatCurrency(value as number) }]}
      series={[
        {
          dataKey: "value",
          valueFormatter: (value) => formatCurrency(value as number),
          color: "#F44336",
          label: "Inventory Carry Cost (ICC)",
        },
      ]}
      layout="horizontal"
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

export default ICCGraph;
