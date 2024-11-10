import { Alert, Grid } from "@mui/material";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";
import { PageContent, PageHeader } from "src/components/layout";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { data, isCubeLoading } = useCube();

  const baseData = data?.baseData;
  const cubeParameters = data?.cubeParameters;

  if (!cubeParameters || isCubeLoading) {
    return <Alert severity="info">Loading...</Alert>;
  }

  return (
    <>
      <PageHeader
        title="Data Mining"
        description="Data Mining Categories & Drivers"
      />

      <PageContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CategoriesTable
              data={baseData?.categoriesData}
              drivers={cubeParameters!.drivers}
            />
          </Grid>
          <Grid item container xs={12}>
            <CategoriesGraph
              data={baseData!.categoriesData}
              drivers={cubeParameters!.drivers}
            />
          </Grid>
          <Grid item xs={12}>
            <DriversTable
              data={baseData?.driversData}
              categories={cubeParameters?.categories ?? []}
            />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

export default Page;
