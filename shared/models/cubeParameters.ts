import { IDataModelParametersRow } from "./dataModel";
import { IDriver } from "./settings";

export interface IParameter extends IDataModelParametersRow {
  label: string;
  autoCalculated?: boolean;
}

export interface ICubeParameters {
  parameters: IParameter[];
  categories: string[];
  drivers: IDriver[];
}
