import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import ENumberType from "@shared/enums/ENumberType";

export interface IIventoryPerformanceMetric {
  key: EInventoryPerformaceMetricType;
  label: string;
  description: string;
  type: ENumberType;
}

export interface IInventoryPerformanceData {
  rows: Array<
    IIventoryPerformanceMetric & {
      [category: string]: string | number;
      total: number;
    }
  >;
}
