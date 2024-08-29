import { Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import {
  formatCurrency,
  getCategories,
  getSumCostSales,
  getSumSales,
} from "src/utils";
import {
  CATTable,
  CATTableGen,
  ScorecardTableInventory,
  ScorecardTableWarehouse,
} from "./components";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { fileResolution } = useCube();

  const sumSales = useMemo(
    () => getSumSales(fileResolution?.rows),
    [fileResolution]
  );

  const sumCostSales = useMemo(
    () => getSumCostSales(fileResolution?.rows),
    [fileResolution]
  );

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
            Total Sales: {formatCurrency(sumSales)}
          </Typography>
          <Typography variant="body1" mb={2}>
            Total Cost Sales: {formatCurrency(sumCostSales)}
          </Typography>
          <Typography variant="body1" mb={2}>
            Categories: {categories.join(", ")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CATTableGen />
        </Grid>
        <Grid item xs={12}>
          <CATTable />
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
