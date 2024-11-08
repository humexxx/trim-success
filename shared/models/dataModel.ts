import {
  EDataModelParameterSubType,
  EDataModelParameterType,
  EValueType,
} from "@shared/enums";

export interface IDataModelParametersRow {
  type: EDataModelParameterType;
  subType: EDataModelParameterSubType;
  name: string;
  description?: string;
  valueType: EValueType;
  value: number;
}

export interface IDataModelCubeRow {
  id: number;
  [key: string]: string | number;
}

export interface IDataModel<T> {
  rows: T[];
  columns: string[];
}
