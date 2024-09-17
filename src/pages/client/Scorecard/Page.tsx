import { Alert, Grid } from "@mui/material";
import { GlobalLoader, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";
import { ScorecardTableInventory, ScorecardTableWarehouse } from "./components";
import { useScorecardData } from "./hooks";
import { useCallback, useMemo } from "react";
import {
  updateStoringScorecardDataRow,
  updateInventoryScorecardDataRow,
} from "src/utils";
import { useAuth } from "src/context/auth";
import { ICubeData, IScorecardData } from "src/models";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");

  const { currentUser } = useAuth();

  const { data, setData } = useCube();
  const { error, loading, update } = useScorecardData(currentUser?.uid ?? "");

  const scorecardData = data?.scorecardData;
  const paramsData = data?.paramsData;
  const baseData = data?.baseData;

  const investmentTypes = useMemo(
    () =>
      Object.keys(paramsData?.generalParams.financial ?? {}).filter(
        (x) => x !== "sales" && x !== "salesCost"
      ),
    [paramsData]
  );

  const updateStoringCostsRow = useCallback(
    (newRow: IScorecardData["storingCosts"]["rows"][number]) => {
      const data = updateStoringScorecardDataRow(
        newRow,
        scorecardData?.storingCosts.rows ?? [],
        paramsData!,
        baseData!
      );

      setData(
        (prev) =>
          ({
            ...prev,
            scorecardData: {
              ...prev!.scorecardData,
              storingCosts: {
                ...data,
              },
            },
          }) as ICubeData
      );
    },
    [baseData, paramsData, scorecardData?.storingCosts.rows, setData]
  );

  const updateInventoryCostsRow = useCallback(
    (newRow: IScorecardData["inventoryCosts"]["rows"][number]) => {
      const data = updateInventoryScorecardDataRow(
        newRow,
        scorecardData?.inventoryCosts.rows ?? [],
        paramsData!,
        baseData!
      );

      setData(
        (prev) =>
          ({
            ...prev,
            scorecardData: {
              ...prev!.scorecardData,
              inventoryCosts: {
                ...data,
              },
            },
          }) as ICubeData
      );
    },
    [baseData, paramsData, scorecardData?.inventoryCosts.rows, setData]
  );

  if (loading) return <GlobalLoader />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ScorecardTableWarehouse
            data={scorecardData?.storingCosts}
            categories={paramsData?.categories ?? []}
            investmentTypes={investmentTypes}
            updateRow={updateStoringCostsRow}
          />
        </Grid>
        <Grid item xs={12}>
          <ScorecardTableInventory
            data={scorecardData?.inventoryCosts}
            categories={paramsData?.categories ?? []}
            investmentTypes={investmentTypes}
            updateRow={updateInventoryCostsRow}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
