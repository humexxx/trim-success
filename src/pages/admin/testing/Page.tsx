import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import { Grid } from "@mui/material";
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
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<Filter1OutlinedIcon />}
                label="Data Mining"
                description={"Calcular las metricas de categoria y de drivers."}
                onClick={baseData.calculate}
                loading={baseData.loading}
                error={baseData.error}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<Filter2OutlinedIcon />}
                label="Scorecard"
                description={
                  "Calcular el scorecard en base a los datos de categoria y drivers."
                }
                onClick={scorecard.calculate}
                loading={scorecard.loading}
                error={scorecard.error}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<Filter3OutlinedIcon />}
                label="Rendimiento de Inventario"
                description={
                  "Calcular el rendimiento de inventario en base al scorecard."
                }
                onClick={inventoryPerformance.calculateInventoryPerformance}
                loading={inventoryPerformance.loading}
                error={inventoryPerformance.error}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <CardButton
                icon={<Filter3OutlinedIcon />}
                label="Rendimiento de Inventario (Cubo)"
                description={
                  "Calcular el rendimiento de inventario para cada articulo del cubo."
                }
                onClick={
                  inventoryPerformance.calculateDataModelInventoryPerformance
                }
                loading={inventoryPerformance.loading}
                error={inventoryPerformance.error}
              />
            </Grid>
          </Grid>
        </PageContent>
      </PageWrapper>
    </AdminGuard>
  );
};

export default Page;
