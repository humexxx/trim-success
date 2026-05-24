import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ICubeData, IInitCube, IDriver, IFileData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { httpsCallable } from "firebase/functions";
import { GlobalLoader } from "src/components";
import { functions } from "src/lib/firebase";

import { useAuth } from "./hooks";

export interface CubeContextType {
  hasInitialData: boolean;
  setHasInitialData: (hasInitialData: boolean) => void;
  isCubeLoading: boolean;

  getFiles: () => Promise<IFileData[]>;
  fileData?: { columns: string[]; rows: Record<string, unknown>[] };
  setFileData: React.Dispatch<
    React.SetStateAction<
      { columns: string[]; rows: Record<string, unknown>[] } | undefined
    >
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
  const { isAdmin, customUser, currentUser } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ICubeData | undefined>(undefined);
  const [fileData, setFileData] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
  }>();
  const [files, setFiles] = useState<IFileData[] | undefined>();

  const getFiles = useCallback(async (): Promise<IFileData[]> => {
    if (files) return files;

    const getFiles = httpsCallable<
      ICallableRequest,
      ICallableResponse<IFileData[]>
    >(functions, "getFiles");
    const _uid = isAdmin ? customUser!.uid : currentUser!.uid;
    try {
      const response = await getFiles({ uid: _uid });
      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      setFiles(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw new Error("Error fetching files");
    }
  }, [currentUser, customUser, files, isAdmin]);

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
    } catch {
      // Cube load failure → bubble to the route-level handler. The
      // error itself isn't actionable here, so we don't keep it.
      onCubeLoadError();
      setHasInitialData(false);
    } finally {
      setLoading(false);
    }
  }, [currentUser, customUser, isAdmin, onCubeLoadError]);

  useEffect(() => {
    // AuthContext now hydrates `customUser` from localStorage on
    // mount, so we just need to react to its presence: load the cube
    // when we have a target uid, or bubble up if an admin still has
    // nobody selected.
    if (isAdmin ? customUser?.uid : true) loadCubeData();
    else onCubeLoadError();
  }, [currentUser, customUser?.uid, isAdmin, loadCubeData, onCubeLoadError]);

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

  // Memoize the context value so consumers only re-render when one of
  // the actual underlying pieces changes. Without this, every render of
  // CubeProvider creates a fresh `value` object and forces a re-render
  // of every component reading from this context.
  const value: CubeContextType = useMemo(
    () => ({
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
    }),
    [
      hasInitialData,
      loading,
      getFiles,
      fileData,
      data,
      loadCubeData,
      initCube,
      removeCube,
    ]
  );

  return (
    <CubeContext.Provider value={value}>
      {loading ? <GlobalLoader /> : null}
      {children}
    </CubeContext.Provider>
  );
}
