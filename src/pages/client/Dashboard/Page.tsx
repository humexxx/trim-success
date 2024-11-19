import { useMemo, useState } from "react";

import { Grid } from "@mui/material";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { GraphContainer } from "./components";
import {
  ICCGraph,
  ICCvsSalesGraph,
  ICRGraph,
  InventoryValueAddedGraph,
  InventoryValueOverSalesGraph,
} from "../InventoryPerformance/components";

const Page = () => {
  const cube = useCube();
  const [expandedGraph, setExpandedGraph] = useState("");

  const _graphs = useMemo(() => {
    if (!cube.data) return [];
    return [
      {
        key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
        component: (
          <ICRGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICR_PERCENTAGE
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: "icc",
        component: (
          <ICCGraph
            isExpanded={expandedGraph === "icc"}
            scorecard={cube.data.scorecardData}
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.ICC_OVER_SALES,
        component: (
          <ICCvsSalesGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICC_OVER_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICC_OVER_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES,
        component: (
          <InventoryValueOverSalesGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key ===
                  EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED,
        component: (
          <InventoryValueAddedGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key === EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
    ].sort((a, b) => {
      if (expandedGraph === a.key) return -1;
      if (expandedGraph === b.key) return 1;
      return 0;
    });
  }, [cube.data, expandedGraph]);

  if (cube.isCubeLoading || !cube.data) return null;

  return (
    <>
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      />
      <PageContent>
        <Grid container spacing={1} rowGap={2}>
          {_graphs.map((graph) => (
            <GraphContainer
              isExpanded={expandedGraph === graph.key}
              setIsExpanded={() =>
                setExpandedGraph(expandedGraph === graph.key ? "" : graph.key)
              }
            >
              {graph.component}
            </GraphContainer>
          ))}
        </Grid>
      </PageContent>
    </>
  );
};

export default Page;
