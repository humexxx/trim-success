import { Alert, Card, CardContent } from "@mui/material";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { Table } from "./components";

const Page = () => {
  const cube = useCube();

  return (
    <PageWrapper title="Rendimiento de Inventario">
      <PageHeader
        title="Rendimiento de Inventario"
        description="Conjunto de métricas que mide la eficiencia y rentabilidad del inventario, optimizando niveles de stock, costos y retornos."
      />
      <PageContent>
        {cube.isCubeLoading || !cube.data ? (
          <Alert severity="info">Cargando...</Alert>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Table
                data={cube.data!.inventoryPerformanceData}
                categories={cube.data!.cubeParameters.categories}
              />
            </CardContent>
          </Card>
        )}
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
