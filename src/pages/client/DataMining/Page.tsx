import { Alert, Grid, Typography } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { useBaseData } from "./hooks";
import { useAuth } from "src/context/auth";
import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { currentUser } = useAuth();
  const { data } = useCube();
  const { loading, error, update } = useBaseData(currentUser!.uid);

  const baseData = data?.baseData;
  const paramsData = data?.paramsData;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" mb={2} color="text.primary">
            General Information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CategoriesTable data={baseData?.categoriesData} />
        </Grid>
        <Grid item xs={12}>
          <CategoriesGraph data={baseData?.categoriesData} />
        </Grid>
        <Grid item xs={12}>
          <DriversTable
            data={baseData?.driversData}
            categories={paramsData?.categories ?? []}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
