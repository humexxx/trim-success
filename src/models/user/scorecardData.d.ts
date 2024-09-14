import { EDriverType } from "src/enums";

export interface IScorecardData {
  storingCosts: {
    rows: {
      cost: string;
      driver?: EDriverType;
      total: number;
      totalPercentage: number;
      invest?: string;
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
      driver: EDriverType;
      total: number;
      totalPercentage: number;
      invest?: string;
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
