import { GridColDef } from "@mui/x-data-grid";
import { ICubeData } from "src/models";

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
  hasInitialData: boolean;
  setHasInitialData: (hasInitialData: boolean) => void;
  setFileResolution: (fileResolution: FileResolution) => void;
  fileResolution?: FileResolution;
  isLoadingCube: boolean;

  data: ICubeData | undefined;
  setData: React.Dispatch<React.SetStateAction<ICubeData | undefined>>;
}
