import { useEffect } from "react";

import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import { Grid } from "@mui/material";
import { EColumnType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import { getColumn, getRowValue } from "@shared/utils";
import { AdminRoute, CardButton, PageHeader } from "src/components";
import { useCube } from "src/context/cube";
import { useBaseData } from "src/pages/client/DataMining/hooks";
import { useInventoryPerformance } from "src/pages/client/InventoryPerformance/hooks";
import { useScorecard } from "src/pages/client/Scorecard/hooks";
import { processJsonData } from "src/utils";

const Page = () => {
  const scorecard = useScorecard();
  const inventoryPerformance = useInventoryPerformance();
  const baseData = useBaseData();
  const cube = useCube();

  async function calculateInventoryPerformance() {
    const response = await inventoryPerformance.calculate();
    console.log(response);
  }

  useEffect(() => {
    async function fetch() {
      const files = await cube.getFiles();
      const jsonFile = files?.find(
        (file) => file.blob.type === "application/json"
      );
      if (jsonFile) {
        const jsonData = JSON.parse(await jsonFile.blob.text());
        const { columns, rows } = await processJsonData(jsonData);

        const inventoryPerformanceData = await inventoryPerformance.get();
        const icrRow = inventoryPerformanceData.rows.find(
          (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
        )!;

        columns.push(ESystemColumnType.ICR_PERCENTAGE);
        for (const row of rows) {
          const category = getRowValue(
            row,
            getColumn(EColumnType.CATEGORY).index! + 1 //remove that  + 1
          );

          const inventoryValue = getRowValue(
            row,
            getColumn(EColumnType.INVENTORY_VALUE).index!
          );
          const icr_percentage = Number(icrRow[category]);
          row[ESystemColumnType.ICR_PERCENTAGE] = icr_percentage;
          row[ESystemColumnType.ICC] = icr_percentage * Number(inventoryValue);
        }

        console.log(rows[0]);
      }
    }
    fetch();
  }, []);

  return (
    <AdminRoute>
      <PageHeader
        title="Testing"
        description="Diferentes funcionalidades para testear."
      >
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
              onClick={calculateInventoryPerformance}
              loading={inventoryPerformance.loading}
              error={inventoryPerformance.error}
            />
          </Grid>
        </Grid>
      </PageHeader>
    </AdminRoute>
  );
};

export default Page;
