import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { IIventoryPerformanceMetric } from "@shared/models";

export const DEFAULT_INVETORY_PERFORMANCE_METRICS: IIventoryPerformanceMetric[] =
  [
    {
      key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
      label: "Tasa de Mantener el Inventario (ICR)",
      description: "ICC / Inv Promedio",
    },
  ];
