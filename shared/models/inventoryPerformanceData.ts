export interface IInventoryPerformanceData {
  rows: {
    label: string;
    description: string;
    [category: string]: string | number;
    total: number;
  }[];
}
