import { Box, Toolbar, Typography } from "@mui/material";
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
  const [sumRow, setSumRow] = useState<ICATGenRow | null>(null);

  useEffect(() => {
    if (fileResolution) {
      setIsLoading(true);
      getAgetCATGenDataAsync(fileResolution.rows!).then((data) => {
        setSumRow({
          id: -1,
          category: "Total",
          skusCount: data.reduce((acc, row) => acc + row.skusCount, 0),
          sumInvAvgQty: data.reduce((acc, row) => acc + row.sumInvAvgQty, 0),
          sumInvAvgValue: data.reduce(
            (acc, row) => acc + row.sumInvAvgValue,
            0
          ),
          sumQtySent: data.reduce((acc, row) => acc + row.sumQtySent, 0),
          sumCubageInvAvg: data.reduce(
            (acc, row) => acc + row.sumCubageInvAvg,
            0
          ),
          sumTotalSales: data.reduce((acc, row) => acc + row.sumTotalSales, 0),
          sumGrossMargin: data.reduce(
            (acc, row) => acc + row.sumGrossMargin,
            0
          ),
        });
        setRows(data);
        setIsLoading(false);
      });
    }
  }, [fileResolution]);

  return (
    <>
      <Box>
        <DataGrid
          aria-label="CAT General Table"
          columns={columns}
          rows={rows}
          loading={isLoading}
          hideFooter
          disableAutosize
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          disableRowSelectionOnClick
          density="compact"
          initialState={{
            sorting: {
              sortModel: [{ field: "category", sort: "asc" }],
            },
          }}
        />
      </Box>
      <Toolbar
        sx={{
          bgcolor: "action.disabledBackground",
          px: "10px !important",
          overflowX: "auto",
        }}
      >
        <Typography variant="body2" flex={1}>
          * Total:
        </Typography>
        {sumRow &&
          Object.values(sumRow)
            .splice(2, Object.values(sumRow).length)
            .map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                minWidth={175}
                textAlign={"right"}
              >
                {typeof value === "number" &&
                (index === 2 || index === 5 || index == 6)
                  ? formatCurrency(value)
                  : value}
              </Typography>
            ))}
      </Toolbar>
    </>
  );
};

export default CATTableGen;
