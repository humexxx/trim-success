import { useMemo, useState } from "react";

import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { Filter, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContent, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { Badge } from "@/components/ui/badge";

import { GraphContainer } from "./components";
import {
  ICCGraph,
  ICCvsSalesGraph,
  ICRGraph,
  InventoryValueAddedGraph,
  InventoryValueOverSalesGraph,
} from "../inventory-performance/components";

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
    <PageWrapper title="Panel" useContainer={false}>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-0 mx-0 h-[400px] rounded-none bg-black lg:mx-2 lg:rounded-2xl" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
          <header className="mb-8 pt-4">
            <h1 className="text-3xl font-semibold text-white">Panel</h1>
            <p className="text-white/80">
              Vista general del comportamiento del negocio
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link to={ROUTES.INVENTORY.IMPORT}>
                <Badge className="cursor-pointer gap-1">
                  <Save className="h-3 w-3" />
                  Archivos Importados
                </Badge>
              </Link>
              <Link to={ROUTES.INVENTORY.DATA_MINING}>
                <Badge
                  variant="outline"
                  className="cursor-pointer gap-1 border-white/40 bg-[#333] text-white"
                >
                  <Filter className="h-3 w-3" />
                  Data Mining
                </Badge>
              </Link>
            </div>
          </header>
          <PageContent>
            <h2 className="mb-2 text-lg font-semibold text-white">
              Indicadores de desempeño
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {_graphs.map((graph) => (
                <GraphContainer
                  key={graph.key}
                  isExpanded={expandedGraph === graph.key}
                  setIsExpanded={() =>
                    setExpandedGraph(
                      expandedGraph === graph.key ? "" : graph.key
                    )
                  }
                >
                  {graph.component}
                </GraphContainer>
              ))}
            </div>
          </PageContent>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Page;
