import {
  EDataModelParameterSubType,
  EDataModelParameterType,
  EValueType,
} from "@shared/enums";

export interface IDataModelParametersRow {
  name: string;
  type: EDataModelParameterType;
  subType: EDataModelParameterSubType;
  description?: string;
  value: number;
  valueType: EValueType;
}

export interface IDataModelCubeRow {
  id: number;
  [key: string]: string | number;
}

export interface IDataModel<T> {
  rows: T[];
  columns: string[];
}
