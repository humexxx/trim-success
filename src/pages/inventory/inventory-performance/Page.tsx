import { Alert } from "@mui/material";
import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { Table } from "./components";

const Page = () => {
  const cube = useCube();

  return (
    <>
      <PageHeader
        title="Rendimiento de Inventario"
        description="Conjunto de métricas que mide la eficiencia y rentabilidad del inventario, optimizando niveles de stock, costos y retornos."
      />
      <PageContent>
        {cube.isCubeLoading || !cube.data ? (
          <Alert severity="info">Cargando...</Alert>
        ) : (
          <Table
            data={cube.data!.inventoryPerformanceData}
            categories={cube.data!.cubeParameters.categories}
          />
        )}
      </PageContent>
    </>
  );
};

export default Page;
