import { IColumn, IDriver } from "@shared/models";

import { EColumnType, EDriverType } from "../enums";
import { getColumnIndex } from "../utils";

export const STORAGE_PATH = "cubes";
export const JSON_FILE_NAME = "parsedData.json"; //TODO: remove extra .json

export const FIRESTORE_PATHS = {
  SETTINGS: {
    INDEX: (uid: string) => `settings/${uid}/data`,
    BASE: (uid: string) => `settings/${uid}/data/base`,
    SCORECARD: (uid: string) => `settings/${uid}/data/scorecard`,
    INVENTORY_PERFORMANCE: (uid: string) =>
      `settings/${uid}/data/inventoryPerformance`,
    PARAMS: (uid: string) => `settings/${uid}/data/params`,
  },
};

export const COLUMNS: IColumn[] = [
  { code: EColumnType.SKU, name: "Codigo Producto", index: 0 },
  { code: EColumnType.CATEGORY, name: "Categoria de Producto", index: 1 },
  {
    code: EColumnType.SUB_CATEGORY,
    name: "Sub Categoria de Producto",
    index: 2,
  },
  { code: EColumnType.DESCRIPTION, name: "Descripcion del Producto", index: 3 },
  { code: EColumnType.PROVIDER, name: "Proveedor", index: 4 },
  { code: EColumnType.COUNTRY, name: "Pais", index: 5 },
  { code: EColumnType.PACKING, name: "Empaque", index: 6 },
  { code: EColumnType.BPP, name: "Cajas por Tarima", index: 7 },
  { code: EColumnType.FORECAST, name: "Pronostico", index: 8 },
  { code: EColumnType.CPT, name: "Cubicaje por Tarima", index: 9 },
  {
    code: EColumnType.INVENTORY_CUBE,
    name: "Cubicaje Inv Promedio",
    index: 10,
  },
  {
    code: EColumnType.TABLE,
    name: "Mes",
    indexRange: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  },
  {
    code: EColumnType.LT,
    name: "LT",
    indexRange: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
  },
  { code: EColumnType.FORECAST_ERROR, name: "Error Pronostico", index: 35 },
  { code: EColumnType.QTY_SOLD, name: "Unidades Vendidas", index: 36 },
  { code: EColumnType.P_SOLD, name: "Bultos Vendidos", index: 37 },
  { code: EColumnType.PRICE, name: "Precio Unitario", index: 38 },
  { code: EColumnType.COST, name: "Costo Unitario", index: 39 },
  { code: EColumnType.S_FACTOR, name: "Factor de Escazes", index: 40 },
  { code: EColumnType.UTILITY_MARGIN, name: "Margen de Utilidad", index: 41 },
  { code: EColumnType.SALES, name: "Ventas Totales", index: 42 },
  { code: EColumnType.COST_SALES, name: "Ventas al Costo", index: 43 },
  { code: EColumnType.GROSS_MARGIN, name: "Gross Margin", index: 44 },
  {
    code: EColumnType.AVERAGE_INVENTORY,
    name: "Inventario Prom Bultos",
    index: 45,
  },
  {
    code: EColumnType.INVENTORY_VALUE,
    name: "Inventario Promedio $",
    index: 46,
  },
  { code: EColumnType.TRANSIT_INV, name: "Inventario en Transito", index: 47 },
  { code: EColumnType.CURRENT_INV, name: "Inventario Actual", index: 48 },
  { code: EColumnType.ROTATION, name: "Rotacion", index: 49 },
  { code: EColumnType.MESES_INV, name: "Meses Inventarios", index: 50 },
  { code: EColumnType.SHIPPED_CASES, name: "Bultos Despachados", index: 51 },
  {
    code: EColumnType.NIVEL_SERVICIO_ACTUAL,
    name: "Nivel de Servicio Actual",
    index: 52,
  },
];

export const DEFAULT_DRIVERS: IDriver[] = [
  {
    label: "Sku's",
    key: EDriverType.SKUS,
    columnIndexReference: getColumnIndex(EColumnType.SKU)!,
    miningLabel: "% Sku's",
    required: true,
  },
  {
    label: "Average Inventory",
    key: EDriverType.AVERAGE_INVENTORY,
    columnIndexReference: getColumnIndex(EColumnType.AVERAGE_INVENTORY)!,
    miningLabel: "% Average Inventory",
    required: true,
  },
  {
    label: "$ Inventory Value",
    key: EDriverType.INVENTORY_VALUE,
    columnIndexReference: getColumnIndex(EColumnType.INVENTORY_VALUE)!,
    miningLabel: "% $ Inventory Value",
    required: true,
  },
  {
    label: "Shipped Cases",
    key: EDriverType.SHIPPED_CASES,
    columnIndexReference: getColumnIndex(EColumnType.SHIPPED_CASES)!,
    miningLabel: "% Shipped Cases",
    required: false,
  },
  {
    label: "Inventory Cube",
    key: EDriverType.INVENTORY_CUBE,
    columnIndexReference: getColumnIndex(EColumnType.INVENTORY_CUBE)!,
    miningLabel: "% Inventory Cube",
    required: true,
  },
  {
    label: "Sales",
    key: EDriverType.SALES,
    columnIndexReference: getColumnIndex(EColumnType.SALES)!,
    miningLabel: "% Sales",
    required: true,
  },
  {
    label: "Planners",
    key: EDriverType.PLANNERS,
    columnIndexReference: -1, // TODO: Add column index
    miningLabel: "% Planners",
    required: false,
    xcatHidden: true,
  },
  {
    label: "Orders",
    key: EDriverType.ORDERS,
    columnIndexReference: -1, // TODO: Add column index
    miningLabel: "% Orders",
    required: false,
    xcatHidden: true,
  },
  {
    label: "Gross Margin",
    key: EDriverType.GROSS_MARGIN,
    columnIndexReference: getColumnIndex(EColumnType.GROSS_MARGIN)!,
    miningLabel: "% Gross Margin",
    required: true,
  },
  {
    label: "Cost Sales",
    key: EDriverType.COST_SALES,
    columnIndexReference: getColumnIndex(EColumnType.COST_SALES)!,
    miningLabel: "",
    required: true,
    xcatHidden: true,
    xdriverHidden: true,
  },
];

export * from "./columns";
export * from "./inventoryPerformance";
