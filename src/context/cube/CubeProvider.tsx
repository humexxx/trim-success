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
import { functions, storage } from "src/firebase";
import { httpsCallable } from "firebase/functions";
import { GlobalLoader } from "src/components";
import { listAll, getBlob, ref } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";

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
  const { isAdmin, customUid, currentUser } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCubeLoading, setIsCubeLoading] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const [fileData, setFileData] = useState<{
    columns: string[];
    rows: any[];
  }>();
  const isInitialLoad = useRef(true);

  const getFile = useCallback(async (): Promise<Blob | undefined> => {
    const folderRef = ref(
      storage,
      `${STORAGE_PATH}/${isAdmin ? customUid : currentUser?.uid}/`
    );

    try {
      const result = await listAll(folderRef);
      if (result.items.length > 0) {
        const firstFileRef = result.items[0];
        const fileBlob = await getBlob(firstFileRef);
        return fileBlob;
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      return undefined;
    }
  }, [currentUser?.uid, customUid, isAdmin]);

  const loadCubeData = useCallback(
    async (triggerSuccess = false) => {
      setIsCubeLoading(true);
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
        setIsCubeLoading(false);
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
    isCubeLoading,

    getFile,
    fileData,
    setFileData,

    data,
    setData,

    reloadCubeData: loadCubeData,
  };

  if (loading) return <GlobalLoader />;

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
