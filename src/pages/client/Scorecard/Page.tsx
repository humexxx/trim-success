import { Grid, Typography } from "@mui/material";
import { PageHeader } from "src/components";
import { ExtraStepToLoad, useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { ScorecardTableInventory, ScorecardTableWarehouse } from "./components";
import { useScorecardData } from "./hooks";
import { useCallback, useEffect, useMemo } from "react";
import { useCatData } from "../CAT/hooks";
import { DRIVERS } from "src/consts";
import { EDriverType } from "src/enums";
import { ICatData, IScorecardData } from "src/models/user";
import {
  getCatDataCategoryFirstAsync,
  getCatDataDriversFirst,
  calculateScorecardData,
  updateStoringScorecardDataRow,
  updateInventoryScorecardDataRow,
} from "src/utils";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");

  const {
    loadCube,
    fileResolution,
    dataParams,
    scorecardData: memoryScorecardData,
    catData: memoryCatData,
  } = useCube();

  const scorecardData = useScorecardData({
    initialData: memoryScorecardData.data ?? null,
  });
  const catData = useCatData({
    initialData: memoryCatData.data ?? null,
  });

  // useEffect(() => {
  //   if (!catData.loading) {
  //     const extraSteps: ExtraStepToLoad[] = [];

  //     if (!catData.data) {
  //       extraSteps.push({
  //         label: "Calcular data mining",
  //         status: "not loaded",
  //         loader: async ({ rows }: any) => {
  //           try {
  //             const categoryFirstData =
  //               await getCatDataCategoryFirstAsync(rows);
  //             const categoryFirstDataTotals = {
  //               category: "Total",
  //               ...DRIVERS.filter((x) => !x.catHiddenByDefault).reduce(
  //                 (acc, driver) => {
  //                   acc[driver.name] = categoryFirstData.reduce(
  //                     (acc, row) =>
  //                       acc + (row[driver.name as EDriverType] as number),
  //                     0
  //                   );
  //                   return acc;
  //                 },
  //                 {} as Omit<
  //                   ICatData["catCategoriesFirst"]["totals"],
  //                   "category" | "sumGrossMargin"
  //                 >
  //               ),
  //               sumOfGrossMargin: categoryFirstData.reduce(
  //                 (acc, row) => acc + row.sumOfGrossMargin,
  //                 0
  //               ),
  //             } as ICatData["catCategoriesFirst"]["totals"];

  //             const driversFirstData = getCatDataDriversFirst(
  //               categoryFirstData,
  //               categoryFirstDataTotals
  //             );
  //             const _catData: ICatData = {
  //               catCategoriesFirst: {
  //                 rows: categoryFirstData,
  //                 totals: categoryFirstDataTotals,
  //               },
  //               catDriversFirst: { rows: driversFirstData },
  //             };
  //             memoryCatData.setData(_catData);
  //             catData.updateCatData(_catData);
  //           } catch (error: any) {
  //             console.error(error.message ?? error.toString());
  //             throw error;
  //           }
  //         },
  //       });
  //       loadCube(extraSteps);
  //     } else {
  //       memoryCatData.setData(catData.data);
  //     }
  //   }
  // }, [fileResolution, loadCube, catData, memoryCatData]);

  useEffect(() => {
    if (!memoryScorecardData.data && catData.data) {
      const data = calculateScorecardData(dataParams.data!, catData.data);
      memoryScorecardData.setData(data);
    }
  }, [
    scorecardData.loading,
    scorecardData.data,
    catData.data,
    dataParams,
    memoryScorecardData,
  ]);

  const investmentTypes = useMemo(
    () =>
      Object.keys(dataParams.data?.generalParams.financial ?? {}).filter(
        (x) => x !== "sales" && x !== "salesCost"
      ),
    [dataParams]
  );

  const updateStoringCostsRow = useCallback(
    (newRow: IScorecardData["storingCosts"]["rows"][number]) => {
      const data = updateStoringScorecardDataRow(
        newRow,
        memoryScorecardData.data?.storingCosts.rows ?? [],
        dataParams.data!,
        catData.data!
      );

      memoryScorecardData.setData({
        ...memoryScorecardData.data!,
        storingCosts: {
          ...data,
        },
      });
    },
    [catData.data, dataParams.data, memoryScorecardData]
  );

  const updateInventoryCostsRow = useCallback(
    (newRow: IScorecardData["inventoryCosts"]["rows"][number]) => {
      const data = updateInventoryScorecardDataRow(
        newRow,
        memoryScorecardData.data?.inventoryCosts.rows ?? [],
        dataParams.data!,
        catData.data!
      );

      memoryScorecardData.setData({
        ...memoryScorecardData.data!,
        inventoryCosts: {
          ...data,
        },
      });
    },
    [catData.data, dataParams.data, memoryScorecardData]
  );

  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ScorecardTableWarehouse
            data={memoryScorecardData.data?.storingCosts}
            categories={dataParams.data?.categories ?? []}
            investmentTypes={investmentTypes}
            updateRow={updateStoringCostsRow}
          />
        </Grid>
        <Grid item xs={12}>
          <ScorecardTableInventory
            data={memoryScorecardData.data?.inventoryCosts}
            categories={dataParams.data?.categories ?? []}
            investmentTypes={investmentTypes}
            updateRow={updateInventoryCostsRow}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
