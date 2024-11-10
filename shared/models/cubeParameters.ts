import { IDataModelParametersRow } from "./dataModel";
import { IDriver } from "./settings";

export interface IParameter extends IDataModelParametersRow {
  autoCalculated?: boolean;
}

export interface ICubeParameters {
  parameters: IParameter[];
  categories: string[];
  drivers: IDriver[];
}
