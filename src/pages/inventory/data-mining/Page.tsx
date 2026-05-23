import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";

const Page = () => {
  useDocumentMetadata("Data Mining - Trim Success");
  const { data, isCubeLoading } = useCube();

  const baseData = data?.baseData;
  const cubeParameters = data?.cubeParameters;

  if (!cubeParameters || isCubeLoading) {
    return (
      <PageWrapper title="Data Mining" maxWidth="2xl">
        <PageHeader title="Data Mining" />
        <Alert className="mt-4">
          <AlertDescription>Cargando...</AlertDescription>
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Data Mining" maxWidth="2xl">
      <PageHeader
        title="Data Mining"
        description="Categorización por driver: cómo se distribuye cada métrica entre las categorías del catálogo."
      />
      <div className="mt-8 flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Categorías</CardTitle>
            <CardDescription className="text-xs">
              Tabla pivote con conteo de SKUs y sumatorias de cada driver por
              categoría.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <CategoriesTable
              data={baseData?.categoriesData}
              drivers={cubeParameters.drivers}
            />
          </CardContent>
        </Card>

        <CategoriesGraph
          data={baseData!.categoriesData}
          drivers={cubeParameters.drivers}
        />

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Drivers</CardTitle>
            <CardDescription className="text-xs">
              Participación porcentual de cada categoría dentro de cada driver.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <DriversTable
              data={baseData?.driversData}
              categories={cubeParameters?.categories ?? []}
            />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Page;
