export interface IStoringDataParams {
  costs: {
    manoObraCost: number;
    alquilerCost: number;
    suministroOficinaCost: number;
    energiaCost: number;
    tercerizacionCost: number;
    otherCosts: number;
    [key: string]: number;
  };
  investments: {
    terrenoEdificio: number;
    manejoMateriales: number;
    almacenajeMateriales: number;
    administracionAlmacen: number;
    otrasInversiones: number;
    [key: string]: number;
  };
}

export interface IInventoryDataParams {
  costs: {
    manoObraCost: number;
    insuranceCost: number;
    energyCost: number;
    officeSupplyCost: number;
    officeSpaceCost: number;
    otherCosts: number;
    [key: string]: number;
  };
  investments: {
    hardwareInvestment: number;
    inventoryInvestment: number;
    managementSystemInvestment: number;
    [key: string]: number;
  };
}

export interface IGeneralDataParams {
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

export interface IDataParams {
  generalParams: IGeneralParams;
  storingParams: IStoringParams;
  inventoryParams: IInventoryParams;
  categories: string[];
}
