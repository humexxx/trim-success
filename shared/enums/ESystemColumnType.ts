import { EInventoryPerformaceMetricType } from "./EInventoryPerformaceMetricType";

export const ESystemColumnType = {
  ICR_PERCENTAGE: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
  ICC: "system_icc",
} as const;

export type ESystemColumnType =
  (typeof ESystemColumnType)[keyof typeof ESystemColumnType];
