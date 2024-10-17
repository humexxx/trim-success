import { IBaseData } from "./baseData";
import { IInventoryPerformanceData } from "./inventoryPerformance";
import { IParamsData } from "./paramsData";
import { IScorecardData } from "./scorecardData";

export interface ICubeData {
  paramsData: IParamsData;
  baseData: IBaseData;
  scorecardData: IScorecardData;
  inventoryPerformanceData: IInventoryPerformanceData;
}

export interface IInitCube {
  fileUid: string;
  cubeParameters: IParamsData;
}

export interface IInitialCubeData {
  categories: string[];
  sumSales: number;
  sumCostSales: number;
  sumCostInventory: number;
}
