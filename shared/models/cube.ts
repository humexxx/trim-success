import { IBaseData } from "./baseData";
import { ICubeParameters } from "./cubeParameters";
import { IInventoryPerformanceData } from "./inventoryPerformance";
import { IScorecardData } from "./scorecardData";
import { IDriver } from "./settings";

export interface ICubeData {
  cubeParameters: ICubeParameters;
  baseData: IBaseData;
  scorecardData: IScorecardData;
  inventoryPerformanceData: IInventoryPerformanceData;
}

export interface IInitCube {
  fileUid: string;
  drivers: IDriver[];
}

export interface IInitialCubeData {
  categories: string[];
  sumSales: number;
  sumCostSales: number;
  sumCostInventory: number;
}
