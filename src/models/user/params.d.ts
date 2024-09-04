export interface IStoringParams {
  manoObraCost: number;
  alquilerCost: number;
  suministroOficinaCost: number;
  energiaCost: number;
  tercerizacionCost: number;
  otherCosts: number;
}

export interface IInventoryParams {
  manoObraCost: number;
  insuranceCost: number;
  energyCost: number;
  officeSupplyCost: number;
  officeSpaceCost: number;
  otherCosts: number;
}

export interface IGeneralParams {
  financial: {
    sales: number;
    salesCost: number;
    inventoryAnnualCost: number;
    companyCapitalCost: number;
    technologyCapitalCost: number;
  };
  operational: {
    annualWorkingHours: number;
  };
}
