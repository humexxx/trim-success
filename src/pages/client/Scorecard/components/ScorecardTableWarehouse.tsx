import { DataGrid, GridColDef } from "@mui/x-data-grid";

const SCORECARD_TABLE_WAREHOUSE_ROWS: { name: string; key: string }[] = [
  {
    name: "Inversión en Terreno y Edificio del Almacén",
    key: "inversion_terreno_edificio_almacen",
  },
  {
    name: "Costo anual de Mano de Obra del Almacén",
    key: "costo_anual_mano_obra_almacen",
  },
  {
    name: "Inversión en Sistemas de Manejo de Materiales",
    key: "inversion_sistemas_manejo_materiales",
  },
  { name: "Sistemas de Almacenamiento", key: "sistemas_almacenamiento" },
  {
    name: "Sistema Administración Almacén WMS",
    key: "sistema_administracion_almacen_wms",
  },
  {
    name: "Costo Suministro Oficina- Almacén",
    key: "costo_suministro_oficina_almacen",
  },
  { name: "Alquiler de Almacén", key: "alquiler_almacen" },
  { name: "Costo de Tercerización – 3PL", key: "costo_tercerizacion_3pl" },
  { name: "Costos de Energía del Almacén", key: "costos_energia_almacen" },
  { name: "Otros Costos de Almacén", key: "otros_costos_almacen" },
];

const COLUMS_DEF: GridColDef[] = [
  {
    field: "name",
    headerName: "Warehousing Costs",
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
      aria-label="Warehousing Costs"
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
