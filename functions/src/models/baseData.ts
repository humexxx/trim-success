export interface IBaseData {
  categoriesData: {
    rows: {
      category: string;
      grossMargin: number;
      [driver: string]: string | number;
    }[];
    totals: {
      category: string;
      grossMargin: number;
      [driver: string]: string | number;
    };
  };
  driversData: {
    rows: {
      driver: string;
      [category: string]: string | number;
    }[];
  };
}
