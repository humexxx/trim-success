import { Grid } from "@mui/material";

import { MainGrid, Reports } from "./components";
import { PageContent, PageHeader } from "src/components/layout";
import { BarChart } from "@mui/x-charts";

const Page = () => {
  return (
    <>
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      />
      <PageContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <BarChart
              xAxis={[
                { scaleType: "band", data: ["group A", "group B", "group C"] },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
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
                  angle: 90,
                  textAnchor: "start",
                  fontSize: 12,
                },
              }}
              margin={{ bottom: 80 }}
            />
          </Grid>
          <Grid item xs={12} lg={9}>
            <MainGrid />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Reports />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

export default Page;
