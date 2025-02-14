import { useCallback, useMemo, useState } from "react";

import { Alert, Card, CardContent, Grid } from "@mui/material";
import {
  EDataModelParameterSubType,
  EDataModelParameterType,
} from "@shared/enums";
import { ICubeData, IScorecardData } from "@shared/models";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";
import {
  updateStoringScorecardDataRow,
  updateInventoryScorecardDataRow,
  getError,
} from "src/utils";

import {
  GrandTotalGrid,
  ScorecardTableInventory,
  ScorecardTableWarehouse,
} from "./components";
import { useScorecard } from "./hooks";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");

  const { data, setData } = useCube();
  const { update } = useScorecard();
  const [error, setError] = useState<string | null>(null);

  const [isStoringCostsLoading, setIsStoringCostsLoading] = useState(false);
  const [isInventoryCostsLoading, setIsInventoryCostsLoading] = useState(false);

  const scorecardData = data?.scorecardData;
  const paramsData = data?.cubeParameters;
  const baseData = data?.baseData;

  const investmentTypes = useMemo(
    () =>
      paramsData?.parameters.filter(
        (x) =>
          x.type === EDataModelParameterType.GENERAL &&
          x.subType === EDataModelParameterSubType.FINACIAL &&
          !x.autoCalculated
      ),
    [paramsData]
  );

  const updateStoringCostsRow = useCallback(
    async (newRow: IScorecardData["storingCosts"]["rows"][number]) => {
      try {
        setIsStoringCostsLoading(true);

        const data = updateStoringScorecardDataRow(
          newRow,
          scorecardData?.storingCosts.rows ?? [],
          paramsData!,
          baseData!
        );

        const newScorcardData: IScorecardData = {
          ...scorecardData!,
          storingCosts: {
            ...data,
          },
        };

        await update(newScorcardData);

        setData(
          (prev) =>
            ({
              ...prev,
              scorecardData: newScorcardData,
            }) as ICubeData
        );
      } catch (error) {
        setError(getError(error));
      } finally {
        setIsStoringCostsLoading(false);
      }
    },
    [baseData, paramsData, scorecardData, setData, update]
  );

  const updateInventoryCostsRow = useCallback(
    async (newRow: IScorecardData["inventoryCosts"]["rows"][number]) => {
      try {
        setIsInventoryCostsLoading(true);

        const data = updateInventoryScorecardDataRow(
          newRow,
          scorecardData?.inventoryCosts.rows ?? [],
          paramsData!,
          baseData!
        );

        const newScorcardData: IScorecardData = {
          ...scorecardData!,
          inventoryCosts: {
            ...data,
          },
        };

        await update(newScorcardData);

        setData(
          (prev) =>
            ({
              ...prev,
              scorecardData: newScorcardData,
            }) as ICubeData
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsInventoryCostsLoading(false);
      }
    },
    [baseData, paramsData, scorecardData, setData, update]
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <PageWrapper title="Scorecard">
      <PageHeader
        title="Scorecard"
        description="Scorecard del Almacén & Inventory"
      />
      <PageContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <ScorecardTableWarehouse
                  data={scorecardData?.storingCosts}
                  categories={paramsData?.categories ?? []}
                  investmentTypes={investmentTypes ?? []}
                  updateRow={updateStoringCostsRow}
                  drivers={paramsData?.drivers ?? []}
                  loading={isStoringCostsLoading}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <ScorecardTableInventory
                  loading={isInventoryCostsLoading}
                  data={scorecardData?.inventoryCosts}
                  categories={paramsData?.categories ?? []}
                  investmentTypes={investmentTypes ?? []}
                  updateRow={updateInventoryCostsRow}
                  drivers={paramsData?.drivers ?? []}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <GrandTotalGrid
                  categories={paramsData?.categories ?? []}
                  loading={isStoringCostsLoading || isInventoryCostsLoading}
                  data={scorecardData}
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
