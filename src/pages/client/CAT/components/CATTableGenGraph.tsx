import { Box, Toolbar, Typography } from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useCube } from "src/context/cube";
import { formatCurrency, getAgetCATGenDataAsync } from "src/utils";

export interface ICATGenRow {
  id: number;
  category: string;
  skusCount: number;
  sumInvAvgQty: number;
  sumInvAvgValue: number;
  sumQtySent: number;
  sumCubageInvAvg: number;
  sumTotalSales: number;
  sumGrossMargin: number;
}

const columns: GridColDef[] = [
  {
    field: "category",
    headerName: "Rotulos de fila",
    flex: 1,
  },
  {
    field: "skusCount",
    headerName: "Count of Codigo Producto",
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumInvAvgQty",
    headerName: "Sum of Inventario Prom. Bultos",
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumInvAvgValue",
    headerName: "Sum of Inventario Prom. $",
    valueFormatter: formatCurrency,
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumQtySent",
    headerName: "Sum of Bultos Despachados",
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumCubageInvAvg",
    headerName: "Sum of Cubicaje Inv Prom.",
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumTotalSales",
    headerName: "Sum of Ventas Totales",
    valueFormatter: formatCurrency,
    type: "number",
    minWidth: 175,
  },
  {
    field: "sumGrossMargin",
    headerName: "Sum of Gross Margin",
    valueFormatter: formatCurrency,
    type: "number",
    minWidth: 175,
  },
];

const CATTableGen = () => {
  const { fileResolution } = useCube();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<ICATGenRow[]>([]);

  useEffect(() => {
    if (fileResolution) {
      setIsLoading(true);
      getAgetCATGenDataAsync(fileResolution.rows!).then((data) => {
        setRows(data);
        setIsLoading(false);
      });
    }
  }, [fileResolution]);

  return (
    <Box height={350}>
      <PieChart
        loading={isLoading}
        series={[
          {
            data: rows.map((x) => ({
              id: x.id,
              value: x.skusCount,
              label: x.category,
            })),
            highlightScope: { fade: "global", highlight: "series" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 0,
            outerRadius: 100,
            id: "series-1",
          },
          {
            data: rows.map((x) => ({
              id: x.id,
              value: x.sumTotalSales,
              label: x.category,
            })),
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 120,
            outerRadius: 160,
            id: "series-2",
          },
        ]}
      />
    </Box>
  );
};

export default CATTableGen;
