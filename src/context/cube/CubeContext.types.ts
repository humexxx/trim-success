import { ICubeData } from "src/models";

export interface CubeContextType {
  hasInitialData: boolean;
  setHasInitialData: (hasInitialData: boolean) => void;
  isLoadingCube: boolean;

  data: ICubeData | undefined;
  setData: React.Dispatch<React.SetStateAction<ICubeData | undefined>>;

  reloadCubeData: (triggerSuccess?: boolean) => Promise<void>;
}
