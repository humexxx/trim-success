export interface IStoringParams {
  manoObraCost: number;
  alquilerCost: number;
  suministroOficinaCost: number;
  energiaCost: number;
  tercerizacionCost: number;
  otherCosts: number;
  [key: string]: number;
}

export interface IInventoryParams {
  manoObraCost: number;
  insuranceCost: number;
  energyCost: number;
  officeSupplyCost: number;
  officeSpaceCost: number;
  otherCosts: number;
  [key: string]: number;
}

export interface IGeneralParams {
  financial: {
    sales: number;
    salesCost: number;
    inventoryAnnualCost: number;
    companyCapitalCost: number;
    technologyCapitalCost: number;
    [key: string]: number;
  };
  operational: {
    annualWorkingHours: number;
    [key: string]: number;
  };
}

export interface IParams {
  generalParams: IGeneralParams;
  storingParams: IStoringParams;
  inventoryParams: IInventoryParams;
  categories: string[];
}
