export interface IDriver {
  name: string;
  catDescription: string;
  catHiddenByDefault?: boolean;
}

export interface IColumn {
  code: string;
  index?: number;
  indexRange?: number[];
  name: string;
}
