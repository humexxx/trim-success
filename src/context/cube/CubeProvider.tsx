import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STORAGE_PATH } from "@shared/consts";
import { ICubeData } from "@shared/models";
import { httpsCallable } from "firebase/functions";
import { listAll, getBlob, ref } from "firebase/storage";
import { GlobalLoader } from "src/components";
import { LOCAL_STORAGE_KEYS } from "src/consts";
import { functions, storage } from "src/firebase";

import { useAuth } from "../auth";
import { CubeContextType } from "./CubeContext.types";

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
  const { isAdmin, customUser, currentUser, setCustomUser } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const [fileData, setFileData] = useState<{
    columns: string[];
    rows: any[];
  }>();
  const [files, setFiles] = useState<
    { name: string; blob: Blob }[] | undefined
  >();

  const getFiles = useCallback(async (): Promise<
    { name: string; blob: Blob }[] | undefined
  > => {
    const folderRef = ref(
      storage,
      `${STORAGE_PATH}/${isAdmin ? customUser?.uid : currentUser?.uid}/`
    );
    if (files) return files;
    try {
      const result = await listAll(folderRef);
      if (result.items.length) {
        const files = await Promise.all(
          result.items.map(async (itemRef) => {
            const blob = await getBlob(itemRef);
            return {
              name: itemRef.name,
              blob: blob,
            };
          })
        );
        setFiles(files);
        return files;
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      return undefined;
    }
  }, [currentUser?.uid, customUser?.uid, files, isAdmin]);

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
    else {
      const localStorageCustomUser = localStorage.getItem(
        LOCAL_STORAGE_KEYS.CUSTOM_USER
      );
      if (localStorageCustomUser) {
        setCustomUser(JSON.parse(localStorageCustomUser));
      } else {
        onCubeLoadError();
      }
    }
  }, [
    currentUser,
    customUser?.uid,
    isAdmin,
    loadCubeData,
    onCubeLoadError,
    setCustomUser,
  ]);

  const value: CubeContextType = {
    hasInitialData,
    setHasInitialData,
    isCubeLoading: loading,

    getFiles,
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
