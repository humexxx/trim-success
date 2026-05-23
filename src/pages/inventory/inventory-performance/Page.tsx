import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Table } from "./components";

const Page = () => {
  const cube = useCube();

  return (
    <PageWrapper
      title="Rendimiento de inventario"
      description="Métricas de rotación, días de inventario y eficiencia operativa por categoría."
      maxWidth="2xl"
    >
      <PageHeader
        title="Rendimiento de inventario"
        description="Conjunto de métricas que mide la eficiencia y rentabilidad del inventario: rotación, días-360, ICC, IVA y más."
      />
      <div className="mt-8">
        {cube.isCubeLoading || !cube.data ? (
          <Alert>
            <AlertDescription>Cargando...</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Métricas por categoría</CardTitle>
              <CardDescription className="text-xs">
                Cada fila es una métrica de rendimiento; cada columna es una
                categoría más el total agregado.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pb-4 pt-0">
              <Table
                data={cube.data.inventoryPerformanceData}
                categories={cube.data.cubeParameters.categories}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};

export default Page;
