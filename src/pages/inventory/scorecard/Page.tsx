import { useCallback, useMemo, useState } from "react";

import {
  EDataModelParameterSubType,
  EDataModelParameterType,
} from "@shared/enums";
import { ICubeData, IScorecardCostRow, IScorecardData } from "@shared/models";
import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import {
  getError,
  updateInventoryScorecardDataRow,
  updateStoringScorecardDataRow,
} from "src/utils";

import { GrandTotalGrid, ScorecardTable } from "./components";
import { useScorecard } from "./hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const PAGE_DESCRIPTION =
  "Scorecard editable con drivers de costo de mantener inventario por categoría.";

const Page = () => {
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
    async (newRow: IScorecardCostRow) => {
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
          storingCosts: { ...data },
        };
        await update(newScorcardData);
        setData(
          (prev) =>
            ({ ...prev, scorecardData: newScorcardData }) as ICubeData
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
    async (newRow: IScorecardCostRow) => {
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
          inventoryCosts: { ...data },
        };
        await update(newScorcardData);
        setData(
          (prev) =>
            ({ ...prev, scorecardData: newScorcardData }) as ICubeData
        );
      } catch (error) {
        setError(getError(error));
      } finally {
        setIsInventoryCostsLoading(false);
      }
    },
    [baseData, paramsData, scorecardData, setData, update]
  );

  if (error) {
    return (
      <PageWrapper title="Scorecard" description={PAGE_DESCRIPTION}>
        <PageHeader title="Scorecard" />
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Scorecard" description={PAGE_DESCRIPTION}>
      <PageHeader
        title="Scorecard financiero"
        description="Costos de almacenaje e inventario por categoría — edita drivers e investment types inline para recalcular en tiempo real."
      />
      <div className="mt-8 flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Warehousing costs</CardTitle>
            <CardDescription className="text-xs">
              Costos directos de almacenaje distribuidos por categoría según el
              driver seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <ScorecardTable
              title="Warehousing Costs"
              footerLabel="Costo total de Almacenaje"
              data={scorecardData?.storingCosts}
              categories={paramsData?.categories ?? []}
              investmentTypes={investmentTypes ?? []}
              updateRow={updateStoringCostsRow}
              drivers={paramsData?.drivers ?? []}
              loading={isStoringCostsLoading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Costos del inventario</CardTitle>
            <CardDescription className="text-xs">
              Costos asociados al inventario — handling, deterioro, capital
              invertido.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <ScorecardTable
              title="Costos del Inventario"
              footerLabel="Costo total del Inventario"
              loading={isInventoryCostsLoading}
              data={scorecardData?.inventoryCosts}
              categories={paramsData?.categories ?? []}
              investmentTypes={investmentTypes ?? []}
              updateRow={updateInventoryCostsRow}
              drivers={paramsData?.drivers ?? []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Costo total de inventario (ICC)</CardTitle>
            <CardDescription className="text-xs">
              Suma de storing + inventory por categoría. Punto de entrada al
              análisis de rendimiento.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <GrandTotalGrid
              categories={paramsData?.categories ?? []}
              loading={isStoringCostsLoading || isInventoryCostsLoading}
              data={scorecardData}
            />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Page;
