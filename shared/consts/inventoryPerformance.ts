import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import ENumberType from "@shared/enums/ENumberType";
import { IIventoryPerformanceMetric } from "@shared/models";

export const DEFAULT_INVETORY_PERFORMANCE_METRICS: IIventoryPerformanceMetric[] =
  [
    {
      key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
      label: "Tasa de Mantener el Inventario (ICR)",
      description: "ICC / Inv Promedio",
      type: ENumberType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.ROTACION,
      label: "Rotación",
      description: "Ventas / Inv Prom",
      type: ENumberType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_360,
      label: "Días Inventario - 360 días Inventario",
      description: "360 / Rotación",
      type: ENumberType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_MONTHLY,
      label: "Meses Inventario",
      description: "12 / Rotación",
      type: ENumberType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.ICC_SALES,
      label: "Costo de Mantener Inventarios sobre Ventas",
      description: "ICC / Ventas",
      type: ENumberType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_COST_OVER_AVG_SALES,
      label: "Valor del Inventario sobre Ventas",
      description: "Valor del Inventario sobre Ventas",
      type: ENumberType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_MARGIN_OVER_AVG_SALES,
      label: "Retorno del Margen sobre el Inventario GMROI",
      description: "Retorno del Margen sobre el Inventario GMROI",
      type: ENumberType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_EXPECTED_VALUE,
      label: "Valor Agregado del Inventario IVA™",
      description: "Margen de la Categoría - ICC",
      type: ENumberType.PRICE,
    },
  ];
