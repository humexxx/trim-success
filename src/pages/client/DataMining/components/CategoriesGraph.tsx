import { Box, Grid, Typography } from "@mui/material";
import {
  BarChart,
  BarSeriesType,
  PieChart,
  PieSeriesType,
  PieValueType,
} from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";
import { useMemo } from "react";
import { IBaseData, IDriver } from "@shared/models";
import { formatCurrency, formatPercentage } from "@shared/utils";

interface Props {
  data: IBaseData["categoriesData"];
  drivers: IDriver[];
}

const CategoriesGraph = ({ data, drivers }: Props) => {
  const series = useMemo(() => {
    return drivers
      .filter((x) => x.key === "GROSS_MARGIN" || x.key === "SALES")
      .map((driver) => {
        return {
          id: driver.key,
          data: [...data.rows]
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((row) => Number(row[driver.key])),
          label: driver.label,
          valueFormatter: (value) => formatCurrency(value as number),
        } as MakeOptional<BarSeriesType, "type">;
      });
  }, [data, drivers]);

  const categories = useMemo(
    () => data.rows.map((row) => row.category).sort(),
    [data]
  );

  const series2 = useMemo(() => {
    return [
      {
        id: "SKUS",
        data: data.rows.map((row) => ({
          id: row.category,
          value: Number(row.SKUS),
          label: row.category,
        })),
        outerRadius: 120,
        paddingAngle: 5,
        innerRadius: 40,
        arcLabel: (item) =>
          `${formatPercentage(item.value / (data.totals.SKUS as number))}`,
        arcLabelMinAngle: 35,
      } as MakeOptional<
        PieSeriesType<MakeOptional<PieValueType, "id">>,
        "type"
      >,
    ];
  }, [data.rows, data.totals.SKUS]);

  return (
    <>
      <Grid item xs={6}>
        <Box height={500}>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: categories,
              },
            ]}
            series={series.filter((x) => x.label !== "Sku's")}
            margin={{ left: 100 }}
            axisHighlight={{
              y: "line",
            }}
            grid={{
              horizontal: true,
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box height={500} sx={{ position: "relative" }}>
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: 50,
              width: "100%",
              textAlign: "center",
            }}
          >
            Sku's
          </Typography>
          <PieChart series={series2} title="Sku's" />
        </Box>
      </Grid>
    </>
  );
};

export default CategoriesGraph;
