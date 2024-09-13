import { GridColDef } from "@mui/x-data-grid";
import { ICatData, IDataParams, IScorecardData } from "src/models/user";

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
  customUid?: string;
  setCustomUid: (uid: string) => void;
  loadCube: (extraStepsToLoad?: ExtraStepToLoad[]) => void;
  isCubeLoading: boolean;

  dataParams: {
    data?: IDataParams;
    setData: (data: IDataParams) => void;
  };
  catData: {
    data?: ICatData;
    setData: (data: ICatData) => void;
  };
  scorecardData: {
    data?: IScorecardData;
    setData: (data: IScorecardData) => void;
  };
}

export interface ExtraStepToLoad {
  loader: (data?: any) => Promise<void>;
  label: string;
  status: "not loaded" | "loaded" | "loading";
}
