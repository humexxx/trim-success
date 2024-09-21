import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
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
  children: ReactNode;
}

export default function CubeProvider({
  children,
  onCubeLoadError,
}: CubeProviderProps) {
  const { isAdmin, customUser, currentUser } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const [fileData, setFileData] = useState<{
    columns: string[];
    rows: any[];
  }>();

  const getFile = useCallback(async (): Promise<Blob | undefined> => {
    const folderRef = ref(
      storage,
      `${STORAGE_PATH}/${isAdmin ? customUser?.uid : currentUser?.uid}/`
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
  }, [currentUser?.uid, customUser?.uid, isAdmin]);

  const loadCubeData = useCallback(async () => {
    const _uid = isAdmin ? customUser!.uid : currentUser!.uid;
    setLoading(true);
    const getCubeData = httpsCallable(functions, "getCubeData");

    try {
      const response = await getCubeData({ uid: _uid });
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
    }
  }, [currentUser, customUser, isAdmin, onCubeLoadError]);

  useEffect(() => {
    if (isAdmin ? customUser?.uid : true) loadCubeData();
    else onCubeLoadError();
  }, [currentUser, customUser?.uid, isAdmin, loadCubeData, onCubeLoadError]);

  const value: CubeContextType = {
    hasInitialData,
    setHasInitialData,
    isCubeLoading: loading,

    getFile,
    fileData,
    setFileData,

    data,
    setData,

    reloadCubeData: loadCubeData,
  };

  return (
    <CubeContext.Provider value={value}>
      {loading ? <GlobalLoader /> : null}
      {children}
    </CubeContext.Provider>
  );
}
