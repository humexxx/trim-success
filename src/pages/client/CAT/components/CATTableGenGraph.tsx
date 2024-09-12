import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { EDriverType } from "src/enums";
import { ICatData } from "src/models/user";

interface Props {
  data?: ICatData["catCategoriesFirst"];
}

const CATTableGen = ({ data }: Props) => {
  const [rows, setRows] = useState<ICatData["catCategoriesFirst"]["rows"]>([]);

  useEffect(() => {
    if (data?.rows) {
      setRows(data.rows);
    }
  }, [data]);

  return (
    <Box height={350}>
      <PieChart
        series={[
          {
            data: rows.map((x) => ({
              id: x.category,
              value: x[EDriverType.SKUS] as number,
              label: x.category,
            })),
            highlightScope: { fade: "global", highlight: "series" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 0,
            outerRadius: 100,
            id: "series-1",
          },
          {
            data: rows.map((x) => ({
              id: x.category,
              value: x[EDriverType.SALES] as number,
              label: x.category,
            })),
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 120,
            outerRadius: 160,
            id: "series-2",
          },
        ]}
      />
    </Box>
  );
};

export default CATTableGen;
