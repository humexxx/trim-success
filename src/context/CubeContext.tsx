import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STORAGE_PATH } from "@shared/consts";
import { ICubeData, IInitCube, IDriver } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { httpsCallable } from "firebase/functions";
import { listAll, getBlob, ref } from "firebase/storage";
import { GlobalLoader } from "src/components";
import { LOCAL_STORAGE_KEYS } from "src/consts";
import { functions, storage } from "src/firebase";

import { useAuth } from "./hooks";

export interface CubeContextType {
  hasInitialData: boolean;
  setHasInitialData: (hasInitialData: boolean) => void;
  isCubeLoading: boolean;

  getFiles: () => Promise<{ name: string; blob: Blob }[] | undefined>;
  fileData?: { columns: string[]; rows: any[] };
  setFileData: React.Dispatch<
    React.SetStateAction<{ columns: string[]; rows: any[] } | undefined>
  >;

  data: ICubeData | undefined;
  setData: React.Dispatch<React.SetStateAction<ICubeData | undefined>>;

  reloadCubeData: () => Promise<void>;

  initCube: (
    fileUid: string,
    drivers: IDriver[]
  ) => Promise<ICallableResponse<ICubeData>>;
  removeCube: () => Promise<ICallableResponse>;
}

const CubeContext = createContext<CubeContextType | undefined>(undefined);

export default CubeContext;

interface Props {
  onCubeLoadError: () => void;
  children: ReactNode;
}

export function CubeProvider({ children, onCubeLoadError }: Props) {
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
    if (files) return files;
    const folderRef = ref(
      storage,
      `${STORAGE_PATH}/${isAdmin ? customUser?.uid : currentUser?.uid}/`
    );
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
    const getCubeData = httpsCallable<
      ICallableRequest,
      ICallableResponse<ICubeData>
    >(functions, "getCubeData");

    try {
      const response = await getCubeData({ uid: _uid });
      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      setData(response.data.data);
      setHasInitialData(true);
    } catch (e) {
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

  const initCube = useCallback(
    async (fileUid: string, drivers: IDriver[]) => {
      const initCube = httpsCallable<
        ICallableRequest<IInitCube>,
        ICallableResponse<ICubeData>
      >(functions, "initCube");
      const response = await initCube({
        uid: isAdmin ? customUser!.uid! : currentUser!.uid,
        data: {
          fileUid,
          drivers,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      setLoading(false);
      return response.data;
    },
    [currentUser, customUser, isAdmin]
  );

  const removeCube = useCallback(async () => {
    const removeCubeData = httpsCallable<ICallableRequest, ICallableResponse>(
      functions,
      "removeCubeData"
    );
    const response = await removeCubeData({
      uid: isAdmin ? customUser!.uid! : currentUser!.uid,
    });

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data;
  }, [currentUser, customUser, isAdmin]);

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

    initCube,
    removeCube,
  };

  return (
    <CubeContext.Provider value={value}>
      {loading ? <GlobalLoader /> : null}
      {children}
    </CubeContext.Provider>
  );
}
