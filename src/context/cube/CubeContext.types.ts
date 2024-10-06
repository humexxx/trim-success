import { ICubeData } from "src/models";

export interface CubeContextType {
  hasInitialData: boolean;
  setHasInitialData: (hasInitialData: boolean) => void;
  isCubeLoading: boolean;

  getFiles: () => Promise<
    { name: string; type: string; size: string }[] | undefined
  >;
  fileData?: { columns: string[]; rows: any[] };
  setFileData: React.Dispatch<
    React.SetStateAction<{ columns: string[]; rows: any[] } | undefined>
  >;

  data: ICubeData | undefined;
  setData: React.Dispatch<React.SetStateAction<ICubeData | undefined>>;

  reloadCubeData: () => Promise<void>;
}
