import { Container, Grid } from "@mui/material";
import { PageHeader } from "src/components";
import { GeneralParams, InventoryParams, StoringParams } from "./components";

const Page = () => {
  return (
    <>
      <PageHeader title="Datos Generales" />
      <Container sx={{ marginLeft: 0 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <GeneralParams />
          </Grid>
          <Grid item xs={0} md={6} />
          <Grid item xs={12} md={6}>
            <StoringParams />
          </Grid>
          <Grid item xs={12} md={6}>
            <InventoryParams />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
