import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CubeContextType } from "./CubeContext.types";
import { useAuth } from "../auth";
import { ICubeData } from "src/models";
import { functions } from "src/firebase";
import { httpsCallable } from "firebase/functions";
import { GlobalLoader } from "src/components";

export const CubeContext = createContext<CubeContextType | undefined>(
  undefined
);

interface CubeProviderProps {
  onCubeLoadError: () => void;
  onCubeLoadSuccess: () => void;
  children: ReactNode;
}

export default function CubeProvider({
  children,
  onCubeLoadError,
  onCubeLoadSuccess,
}: CubeProviderProps) {
  const { isAdmin, customUid } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingCube, setIsLoadingCube] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const isInitialLoad = useRef(true);

  const loadCubeData = useCallback(
    async (triggerSuccess = false) => {
      setIsLoadingCube(true);
      const getCubeData = httpsCallable(functions, "getCubeData");

      try {
        if (isAdmin && !customUid) {
          throw new Error("Custom UID is required for admin");
        }

        const response = await getCubeData(isAdmin ? { uid: customUid } : null);
        const data = response.data as ICubeData | { error: string };

        if ("error" in data) {
          throw new Error(data.error);
        }
        setData(data);
        setHasInitialData(true);
      } catch (e) {
        // console.error(e);
        onCubeLoadError();
        setHasInitialData(false);
      } finally {
        setLoading(false);
        setIsLoadingCube(false);
        if (triggerSuccess) onCubeLoadSuccess();
      }
    },
    [customUid, isAdmin, onCubeLoadError, onCubeLoadSuccess]
  );

  useEffect(() => {
    loadCubeData(!isInitialLoad.current);
    isInitialLoad.current = false;
  }, [loadCubeData]);

  const value: CubeContextType = {
    hasInitialData,
    setHasInitialData,
    isLoadingCube,

    data,
    setData,

    reloadCubeData: loadCubeData,
  };

  if (loading) return <GlobalLoader />;

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
