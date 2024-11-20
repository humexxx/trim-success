import { Grid } from "@mui/material";
import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { MainGrid, Reports } from "./components";

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
