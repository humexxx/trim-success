import { DataGrid, GridColDef } from "@mui/x-data-grid";

const COLUMS_DEF: GridColDef[] = [
  {
    field: "id",
    headerName: "Warehousing Costs",
  },
  {
    field: "driver",
    headerName: "Driver",
  },
  {
    field: "etp",
    headerName: "Estampapdo en Tejido Punto",
  },
  {
    field: "mainProduct",
    headerName: "Producto Principal",
  },
  {
    field: "totalCosts",
    headerName: "Costo Totales",
  },
  {
    field: "costPercentage",
    headerName: "% Cost",
  },
];

const ScorecardTable = () => {
  const rows: any[] = [];
  return <DataGrid columns={COLUMS_DEF} rows={rows} />;
};

export default ScorecardTable;
