import { EDriverType } from "src/enums";

export interface ICatData {
  catCategoriesFirst: {
    rows: {
      category: string;
      sumOfGrossMargin: number;
      [driver: string]: string | number;
    }[];
    totals: {
      category: string;
      sumOfGrossMargin: number;
      [driver: string]: string | number;
    };
  };
  catDriversFirst: {
    rows: {
      driver: EDriverType;
      [category: string]: string | number;
    }[];
  };
}
