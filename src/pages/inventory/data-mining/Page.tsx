import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const Page = () => {
  useDocumentMetadata(
    "Data Mining",
    "Exploración de patrones y segmentación de SKUs sobre el cubo cargado."
  );
  const { data, isCubeLoading } = useCube();

  const baseData = data?.baseData;
  const cubeParameters = data?.cubeParameters;

  if (!cubeParameters || isCubeLoading) {
    // Skeleton mirrors the final layout — table card, two-chart row,
    // drivers card — so the page doesn't reflow when data lands.
    return (
      <PageWrapper title="Data Mining">
        <PageHeader
          title="Data Mining"
          description="Categorización por driver: cómo se distribuye cada métrica entre las categorías del catálogo."
        />
        <div className="mt-8 flex flex-col gap-6">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[0, 1].map((i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-80" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Data Mining">
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
