export interface IScorecardCostRow {
  cost: string;
  driver: string;
  total: number;
  totalPercentage: number;
  invest: string;
  [category: string]: string | number;
}

export interface IScorecardCostBlock {
  rows: IScorecardCostRow[];
  totals: {
    total: number;
    totalPercentage: number;
    [category: string]: string | number;
  };
}

export interface IScorecardData {
  storingCosts: IScorecardCostBlock;
  inventoryCosts: IScorecardCostBlock;
}
