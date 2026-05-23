import { Beaker, ChartLine, Filter } from "lucide-react";
import { AdminGuard, CardButton } from "src/components";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useBaseData } from "src/pages/inventory/data-mining/hooks";
import { useInventoryPerformance } from "src/pages/inventory/inventory-performance/hooks";
import { useScorecard } from "src/pages/inventory/scorecard/hooks";

const Page = () => {
  const scorecard = useScorecard();
  const inventoryPerformance = useInventoryPerformance();
  const baseData = useBaseData();

  return (
    <AdminGuard>
      <PageWrapper title="Testing">
        <PageHeader
          title="Testing"
          description="Diferentes funcionalidades para testear."
        />
        <PageContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CardButton
              icon={<Filter className="h-5 w-5 text-muted-foreground" />}
              label="Data Mining"
              description="Calcular las metricas de categoria y de drivers."
              onClick={baseData.calculate}
              loading={baseData.loading}
              error={baseData.error}
            />
            <CardButton
              icon={<ChartLine className="h-5 w-5 text-muted-foreground" />}
              label="Scorecard"
              description="Calcular el scorecard en base a los datos de categoria y drivers."
              onClick={scorecard.calculate}
              loading={scorecard.loading}
              error={scorecard.error}
            />
            <CardButton
              icon={<Beaker className="h-5 w-5 text-muted-foreground" />}
              label="Rendimiento de Inventario"
              description="Calcular el rendimiento de inventario en base al scorecard."
              onClick={inventoryPerformance.calculateInventoryPerformance}
              loading={inventoryPerformance.loading}
              error={inventoryPerformance.error}
            />
            <CardButton
              icon={<Beaker className="h-5 w-5 text-muted-foreground" />}
              label="Rendimiento de Inventario (Cubo)"
              description="Calcular el rendimiento de inventario para cada articulo del cubo."
              onClick={
                inventoryPerformance.calculateDataModelInventoryPerformance
              }
              loading={inventoryPerformance.loading}
              error={inventoryPerformance.error}
            />
          </div>
        </PageContent>
      </PageWrapper>
    </AdminGuard>
  );
};

export default Page;
