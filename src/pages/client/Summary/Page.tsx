import { Grid } from "@mui/material";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { MainGrid, Reports } from "./components";
import {
  ICCGraph,
  ICCvsSalesGraph,
  ICRGraph,
  InventoryValueAddedGraph,
  InventoryValueOverSalesGraph,
} from "../InventoryPerformance/components";

const Page = () => {
  const cube = useCube();

  if (cube.isCubeLoading || !cube.data) return null;

  console.log(cube.data.inventoryPerformanceData.rows);

  return (
    <>
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      />
      <PageContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} xl={4}>
            <ICRGraph
              data={
                cube.data.inventoryPerformanceData.rows.find(
                  (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
                )!
              }
              categories={cube.data.cubeParameters.categories}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <ICCGraph
              scorecard={cube.data.scorecardData}
              categories={cube.data.cubeParameters.categories}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <ICCvsSalesGraph
              data={
                cube.data.inventoryPerformanceData.rows.find(
                  (x) => x.key === EInventoryPerformaceMetricType.ICC_OVER_SALES
                )!
              }
              categories={cube.data.cubeParameters.categories}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <InventoryValueOverSalesGraph
              data={
                cube.data.inventoryPerformanceData.rows.find(
                  (x) =>
                    x.key ===
                    EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
                )!
              }
              categories={cube.data.cubeParameters.categories}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <InventoryValueAddedGraph
              data={
                cube.data.inventoryPerformanceData.rows.find(
                  (x) =>
                    x.key ===
                    EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
                )!
              }
              categories={cube.data.cubeParameters.categories}
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
