import { IDriver } from "./settings";

export interface IParam {
  label: string;
  key: string;
  value: number;
  hint?: string;
  type: "percentage" | "currency" | "number";
}

export interface IStoringParamsData {
  costs: IParam[];
  investments: IParam[];
}

export interface IInventoryParamsData {
  costs: IParam[];
  investments: IParam[];
}

export interface IGeneralParamsData {
  financial: IParam[];
  operational: IParam[];
}

export interface IParamsData {
  generalParams: IGeneralParamsData;
  storingParams: IStoringParamsData;
  inventoryParams: IInventoryParamsData;
  categories: string[];
  drivers: IDriver[];
}
