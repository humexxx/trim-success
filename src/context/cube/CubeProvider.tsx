import { createContext, ReactNode, useCallback, useState } from "react";
import {
  CubeContextType,
  ExtraStepToLoad,
  FileResolution,
} from "./CubeContext.types";
import { useAuth } from "../auth";
import { ICatData, IDataParams } from "src/models/user";
import CubeLoader from "./CubeLoader";

export const CubeContext = createContext<CubeContextType | undefined>(
  undefined
);

interface CubeProviderProps {
  children: ReactNode;
}

export default function CubeProvider({ children }: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const user = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [customUid, setCustomUid] = useState<string>();
  const [loadCube, setLoadCube] = useState(false);
  const [extraStepsToLoad, setExtraStepsToLoad] = useState<ExtraStepToLoad[]>(
    []
  );

  const [dataParams, setDataParams] = useState<IDataParams | undefined>();
  const [catData, setCatData] = useState<ICatData | undefined>();

  const _loadCube = useCallback((extraStepsToLoad?: ExtraStepToLoad[]) => {
    if (extraStepsToLoad) setExtraStepsToLoad(extraStepsToLoad);
    setLoadCube(true);
  }, []);

  const value: CubeContextType = {
    hasInitialData,
    setHasInitialData,
    fileResolution,
    setFileResolution,
    customUid,
    setCustomUid,

    isCubeLoading: loadCube,
    loadCube: _loadCube,

    dataParams: {
      data: dataParams,
      setData: setDataParams,
    },
    catData: {
      data: catData,
      setData: setCatData,
    },
  };

  return (
    <CubeContext.Provider value={value}>
      <CubeLoader
        extraStepsToLoad={extraStepsToLoad}
        setExtraStepsToLoad={setExtraStepsToLoad}
        setFileResolution={setFileResolution}
        loadCube={loadCube}
        setLoadCube={setLoadCube}
        userId={user.currentUser!.uid}
      />
      {children}
    </CubeContext.Provider>
  );
}
