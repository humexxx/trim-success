import { Grid } from "@mui/material";
import { AdminRoute, CardButton, PageHeader } from "src/components";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import { useInventoryPerformance } from "src/pages/client/InventoryPerformance/hooks";
import { useState } from "react";
import { getError } from "src/utils";
import { useScorecard } from "src/pages/client/Scorecard/hooks";

const Page = () => {
  const [error, setError] = useState("");

  const scorecard = useScorecard();
  const inventoryPerformance = useInventoryPerformance();

  async function calculateInventoryPerformance() {
    setError("");
    try {
      const response = await inventoryPerformance.calculate();
      console.log(response);
    } catch (error) {
      setError(getError(error));
    }
  }

  return (
    <AdminRoute>
      <PageHeader
        title="Testing"
        description="Diferentes funcionalidades para testear."
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <CardButton
              icon={<Filter2OutlinedIcon />}
              label="Scorecard"
              description={
                "Calcular el scorecard en base a los datos de categoria y drivers."
              }
              onClick={scorecard.calculate}
              loading={scorecard.loading}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <CardButton
              icon={<Filter3OutlinedIcon />}
              label="Rendimiento de Inventario"
              description={
                "Calcular el rendimiento de inventario en base al scorecard."
              }
              onClick={calculateInventoryPerformance}
              loading={inventoryPerformance.loading}
            />
          </Grid>
        </Grid>
      </PageHeader>
    </AdminRoute>
  );
};

export default Page;
