import { createContext, ReactNode, useState } from "react";
import { CubeContextType, FileResolution } from "./CubeContext.types";
import { useAuth } from "../auth";
import { getBlob, listAll, ref } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";
import { getColsAndRowsAsync, getJsonDataFromFileAsync } from "src/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "src/firebase";
import { IDataParams } from "src/models/user";

export const CubeContext = createContext<CubeContextType | undefined>(
  undefined
);

interface CubeProviderProps {
  fallbackRoute: string;
  successRoute: string;
  children: ReactNode;
}

export default function CubeProvider({
  children,
  fallbackRoute,
  successRoute,
}: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const user = useAuth();
  const [loading, setLoading] = useState(false);
  const [customUid, setCustomUid] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const [dataParams, setDataParams] = useState<IDataParams | undefined>();

  async function loadFile(uid?: string) {
    if (!uid) {
      navigate(fallbackRoute, { replace: true });
      setLoading(false);
    }

    setLoading(true);
    const folderRef = ref(storage, `${STORAGE_PATH}/${uid}/`);

    try {
      const result = await listAll(folderRef);
      if (result.items.length > 0) {
        const firstFileRef = result.items[0];
        const fileBlob = await getBlob(firstFileRef);

        const jsonData = await getJsonDataFromFileAsync(fileBlob);
        const { columns, rows } = await getColsAndRowsAsync(jsonData);
        setFileResolution({
          columns,
          rows,
          file: { ...fileBlob, name: firstFileRef.name },
          jsonData,
        });
        if (location.pathname !== "/client/user") navigate(successRoute);
        setLoading(false);
      } else {
        navigate(fallbackRoute, { replace: true });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   loadFile(user.currentUser!.isAdmin ? customUid : user.currentUser!.uid);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [customUid]);

  const value: CubeContextType = {
    fileResolution,
    loading: loading,
    setFileResolution,
    customUid,
    setCustomUid,
    dataParams: {
      data: dataParams,
      setData: setDataParams,
    },
  };

  console.log(dataParams);

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
