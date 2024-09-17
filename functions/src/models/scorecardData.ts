export interface IScorecardData {
  storingCosts: {
    rows: {
      cost: string;
      driver: string;
      total: number;
      totalPercentage: number;
      invest: string;
      [category: string]: string | number;
    }[];
    totals: {
      cost: string;
      total: number;
      totalPercentage: number;
      [category: string]: string | number;
    };
  };
  inventoryCosts: {
    rows: {
      cost: string;
      driver: string;
      total: number;
      totalPercentage: number;
      invest: string;
      [category: string]: string | number;
    }[];
    totals: {
      cost: string;
      total: number;
      totalPercentage: number;
      [category: string]: string | number;
    };
  };
}
