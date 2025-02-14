import { Alert, Card, CardContent, Grid } from "@mui/material";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { data, isCubeLoading } = useCube();

  const baseData = data?.baseData;
  const cubeParameters = data?.cubeParameters;

  if (!cubeParameters || isCubeLoading) {
    return <Alert severity="info">Loading...</Alert>;
  }

  return (
    <PageWrapper title="Data Mining">
      <PageHeader
        title="Data Mining"
        description="Data Mining Categories & Drivers"
      />

      <PageContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <CategoriesTable
                  data={baseData?.categoriesData}
                  drivers={cubeParameters!.drivers}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item container xs={12} spacing={4}>
            <CategoriesGraph
              data={baseData!.categoriesData}
              drivers={cubeParameters!.drivers}
            />
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <DriversTable
                  data={baseData?.driversData}
                  categories={cubeParameters?.categories ?? []}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
