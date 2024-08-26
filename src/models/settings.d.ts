export interface IDriver {
  name: string;
}

export interface IColumn {
  code: string;
  index: number;
  name: string;
}

export interface ISettingsCube {
  drivers: Driver[];
  columns: Column[];
}
