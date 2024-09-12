import { Alert, Grid, Typography } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { CATTable, CATTableGen, CATTableGenGraph } from "./components";
import { useCatData } from "./hooks";
import { useEffect } from "react";
import { getCATGenDataAsync } from "src/utils";
import { ICatData } from "src/models/user";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const {
    loadCube,
    fileResolution,
    catData: { data: memoryData, setData: setMemoryData },
  } = useCube();
  const { data, loading, error, updateCatData } = useCatData({
    initialData: memoryData ?? null,
  });

  useEffect(() => {
    if (!loading) {
      if (!data && !fileResolution?.jsonData) {
        loadCube([
          {
            label: "Calcular Data Mining x CAT",
            status: "not loaded",
            loader: async ({ rows }: any) => {
              try {
                const data = await getCATGenDataAsync(rows);
                const catData: ICatData = {
                  catCategoriesFirst: { rows: data },
                  catDriversFirst: { rows: [] },
                };
                setMemoryData(catData);
                // updateCatData(catData);
              } catch (error: any) {
                console.error(error.message ?? error.toString());
                throw error;
              }
            },
          },
        ]);
      }
    }
  }, [
    data,
    fileResolution,
    fileResolution?.jsonData,
    loadCube,
    loading,
    setMemoryData,
  ]);

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
          <CATTableGen data={memoryData?.catCategoriesFirst} />
        </Grid>
        <Grid item xs={12}>
          <CATTableGenGraph data={memoryData?.catCategoriesFirst} />
        </Grid>
        <Grid item xs={12}>
          <CATTable />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
