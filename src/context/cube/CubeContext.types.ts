import { GridColDef } from "@mui/x-data-grid";

export interface Row {
  id: number;
  [key: string]: any;
}

export interface FileResolution {
  jsonData?: any[][];
  rows?: Row[];
  columns?: GridColDef[];
  file?: (File | Blob) & { name: string };
}
