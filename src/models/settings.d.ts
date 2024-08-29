export interface IDriver {
  name: string;
}

export interface IColumn {
  code: string;
  index?: number;
  indexRange?: number[];
  name: string;
}
