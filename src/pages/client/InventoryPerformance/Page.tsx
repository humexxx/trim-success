import { Alert } from "@mui/material";
import { PageHeader } from "src/components";
import { useCube } from "src/context/hooks";

import { Table } from "./components";

const Page = () => {
  const cube = useCube();

  return (
    <PageHeader
      title="Rendimiento de Inventario"
      description="Conjunto de métricas que mide la eficiencia y rentabilidad del inventario, optimizando niveles de stock, costos y retornos."
    >
      {cube.isCubeLoading || !cube.data ? (
        <Alert severity="info">Cargando...</Alert>
      ) : (
        <Table
          data={cube.data!.inventoryPerformanceData}
          categories={cube.data!.cubeParameters.categories}
        />
      )}
    </PageHeader>
  );
};

export default Page;
