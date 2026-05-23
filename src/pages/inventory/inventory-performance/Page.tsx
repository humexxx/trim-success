import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

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
          <Alert>
            <AlertDescription>Cargando...</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Table
                data={cube.data.inventoryPerformanceData}
                categories={cube.data.cubeParameters.categories}
              />
            </CardContent>
          </Card>
        )}
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
