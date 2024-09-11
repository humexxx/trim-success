import { GridColDef } from "@mui/x-data-grid";
import { IDataParams } from "src/models/user";

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
  customUid?: string;
  setCustomUid: (uid: string) => void;
  dataParams: {
    data?: IDataParams;
    setData: (data: IDataParams) => void;
  };
}
