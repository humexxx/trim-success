import { EColumnType, EDriverType } from "@shared/enums";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";

export interface IDriver {
  label: string;
  miningLabel: string;
  key: EDriverType;
  columnIndexReference: number;
  required: boolean;

  xcatHidden?: boolean;
  xdriverHidden?: boolean;
}

export interface IColumn {
  code: EColumnType | ESystemColumnType;
  index?: number;
  indexRange?: number[];
  name: string;
}

export interface IUser {
  uid: string;
  createdAt: string;
  email: string;
  name: string;
  description: string;
}
