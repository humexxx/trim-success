import { EValueType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { IIventoryPerformanceMetric } from "@shared/models";

export const DEFAULT_INVETORY_PERFORMANCE_METRICS: IIventoryPerformanceMetric[] =
  [
    {
      key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
      label: "Tasa de Mantener el Inventario (ICR)",
      description: "ICC / Inv Promedio",
      valueType: EValueType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.ROTACION,
      label: "Rotación",
      description: "Ventas / Inv Prom",
      valueType: EValueType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_360,
      label: "Días Inventario - 360 días Inventario",
      description: "360 / Rotación",
      valueType: EValueType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_MONTHLY,
      label: "Meses Inventario",
      description: "12 / Rotación",
      valueType: EValueType.OTHER,
    },
    {
      key: EInventoryPerformaceMetricType.ICC_SALES,
      label: "Costo de Mantener Inventarios sobre Ventas",
      description: "ICC / Ventas",
      valueType: EValueType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_COST_OVER_AVG_SALES,
      label: "Valor del Inventario sobre Ventas",
      description: "Valor del Inventario sobre Ventas",
      valueType: EValueType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_MARGIN_OVER_AVG_SALES,
      label: "Retorno del Margen sobre el Inventario GMROI",
      description: "Retorno del Margen sobre el Inventario GMROI",
      valueType: EValueType.PERCENTAGE,
    },
    {
      key: EInventoryPerformaceMetricType.INVENTORY_EXPECTED_VALUE,
      label: "Valor Agregado del Inventario IVA™",
      description: "Margen de la Categoría - ICC",
      valueType: EValueType.AMOUNT,
    },
  ];
