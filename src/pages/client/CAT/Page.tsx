import { Alert, Grid, Typography } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { CATTable, CATTableGen, CATTableGenGraph } from "./components";
import { useCatData } from "./hooks";
import { useEffect } from "react";
import {
  getCatDataCategoryFirstAsync,
  getCatDataDriversFirst,
} from "src/utils";
import { ICatData } from "src/models/user";
import { DRIVERS } from "src/consts";
import { EDriverType } from "src/enums";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const {
    loadCube,
    fileResolution,
    dataParams,
    catData: { data: memoryData, setData: setMemoryData },
  } = useCube();
  const { data, loading, error, updateCatData } = useCatData({
    initialData: memoryData ?? null,
  });

  useEffect(() => {
    if (!loading) {
      if (!data) {
        loadCube([
          {
            label: "Calcular data mining",
            status: "not loaded",
            loader: async ({ rows }: any) => {
              try {
                const categoryFirstData =
                  await getCatDataCategoryFirstAsync(rows);
                const categoryFirstDataTotals = {
                  category: "Total",
                  ...DRIVERS.filter((x) => !x.catHiddenByDefault).reduce(
                    (acc, driver) => {
                      acc[driver.name] = categoryFirstData.reduce(
                        (acc, row) =>
                          acc + (row[driver.name as EDriverType] as number),
                        0
                      );
                      return acc;
                    },
                    {} as Omit<
                      ICatData["catCategoriesFirst"]["totals"],
                      "category" | "sumGrossMargin"
                    >
                  ),
                  sumOfGrossMargin: categoryFirstData.reduce(
                    (acc, row) => acc + row.sumOfGrossMargin,
                    0
                  ),
                } as ICatData["catCategoriesFirst"]["totals"];

                const driversFirstData = getCatDataDriversFirst(
                  categoryFirstData,
                  categoryFirstDataTotals
                );
                const catData: ICatData = {
                  catCategoriesFirst: {
                    rows: categoryFirstData,
                    totals: categoryFirstDataTotals,
                  },
                  catDriversFirst: { rows: driversFirstData },
                };
                setMemoryData(catData);
                updateCatData(catData);
              } catch (error: any) {
                console.error(error.message ?? error.toString());
                throw error;
              }
            },
          },
        ]);
      } else {
        setMemoryData(data);
      }
    }
  }, [
    updateCatData,
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
          <CATTable
            data={memoryData?.catDriversFirst}
            categories={dataParams.data!.categories}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
