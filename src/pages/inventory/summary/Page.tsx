import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MainGrid, Reports } from "./components";

const Page = () => {
  const cube = useCube();

  if (cube.isCubeLoading || !cube.data) return null;

  return (
    <PageWrapper
      title="Resumen"
      description="Indicadores clave del cubo activo: SKUs, categorías, ventas, margen y costo total."
      maxWidth="2xl"
    >
      <PageHeader
        title="Resumen general"
        description="Vista SKU por SKU con filtros y reportes ejecutivos exportables."
      />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-9">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Detalle por SKU</CardTitle>
            <CardDescription className="text-xs">
              Filtra por categoría o por expected value para ver el detalle
              de cada producto.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 pt-0">
            <MainGrid />
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <Reports />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Page;
