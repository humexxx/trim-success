import { GridColDef } from "@mui/x-data-grid";
import { ReactNode } from "react";

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

export interface CubeContextType {
  loading: boolean;
  setFileResolution: (fileResolution: FileResolution) => void;
  fileResolution?: FileResolution;
}

export interface CubeProviderProps {
  children: ReactNode;
}
