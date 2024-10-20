import { Grid } from "@mui/material";
import { PageHeader } from "src/components";

import { MainGrid, Reports } from "./components";

const Page = () => {
  return (
    <>
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      >
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            <MainGrid />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Reports />
          </Grid>
        </Grid>
      </PageHeader>
    </>
  );
};

export default Page;
