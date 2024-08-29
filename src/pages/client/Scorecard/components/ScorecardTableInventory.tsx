import { DataGrid, GridColDef } from "@mui/x-data-grid";

const SCORECARD_TABLE_INVENTORY_ROWS: { name: string; key: string }[] = [
  {
    name: "Costo Financiero del Inventario",
    key: "costo_financiero_inventario",
  },
  {
    name: "Costo Mano de Obra del Inventario",
    key: "costo_mano_obra_inventario",
  },
  { name: "Costo de Equipos del Inventario", key: "costo_equipos_inventario" },
  { name: "Costo de Seguros", key: "costo_seguros" },
  {
    name: "Costo de Espacio de Oficinas - Inventarios",
    key: "costo_espacio_oficinas_inventarios",
  },
  {
    name: "Costo de Suministro  Oficinas Inventarios",
    key: "costo_suministro_oficinas_inventarios",
  },
  { name: "Costo de Energía Inventarios", key: "costo_energia_inventarios" },
  {
    name: "Sistema de Administración de Inventarios",
    key: "sistema_administracion_inventarios",
  },
  { name: "Otros Gastos de Inventarios", key: "otros_gastos_inventarios" },
];

const COLUMS_DEF: GridColDef[] = [
  {
    field: "name",
    headerName: "Costo del Inventario",
  },
  {
    field: "costPercentage",
    headerName: "% Cost",
  },
  {
    field: "driver",
    headerName: "Driver",
  },
  {
    field: "costo_total",
    headerName: "Costo Totales",
  },
  {
    field: "costo_percentage",
    headerName: "% Cost",
  },
];

const ScorecardTable = () => {
  const rows: any[] = [];
  return (
    <DataGrid
      aria-label="Inventory Costs"
      columns={COLUMS_DEF}
      rows={rows}
      hideFooter
      disableAutosize
      disableColumnMenu
      disableColumnResize
      disableColumnSelector
      disableRowSelectionOnClick
    />
  );
};

export default ScorecardTable;
