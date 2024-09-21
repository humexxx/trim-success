export interface IDriver {
  label: string;
  miningLabel: string;
  key: string;
  columnIndexReference: number;
}

export interface IColumn {
  code: string;
  index?: number;
  indexRange?: number[];
  name: string;
}
