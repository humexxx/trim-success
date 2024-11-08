import { EValueType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";

export interface IIventoryPerformanceMetric {
  key: EInventoryPerformaceMetricType;
  label: string;
  description: string;
  valueType: EValueType;
}

export interface IInventoryPerformanceData {
  rows: Array<
    IIventoryPerformanceMetric & {
      [category: string]: string | number;
      total: number;
    }
  >;
}
