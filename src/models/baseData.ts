export interface IBaseData {
  categoriesData: {
    rows: {
      category: string;
      [driver: string]: string | number;
    }[];
    totals: {
      category: string;
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
