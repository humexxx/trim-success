import { Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { getCategories } from "src/utils";
import { ScorecardTableInventory, ScorecardTableWarehouse } from "./components";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { fileResolution } = useCube();

  const categories = useMemo(
    () => getCategories(fileResolution?.rows),
    [fileResolution]
  );

  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" mb={2}>
            General Information
          </Typography>
          <Typography variant="body1" mb={2}>
            Categories: {categories.join(", ")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ScorecardTableWarehouse />
        </Grid>
        <Grid item xs={12}>
          <ScorecardTableInventory />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
