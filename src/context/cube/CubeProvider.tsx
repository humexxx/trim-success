import { useEffect, useState } from "react";
import CubeContext from "./CubeContext";
import {
  CubeContextType,
  CubeProviderProps,
  FileResolution,
} from "./CubeContext.types";
import { useAuth } from "../auth";
import { getBlob, listAll, ref } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";
import { getColsAndRows, getJsonDataFromFile } from "src/utils";
import { useNavigate } from "react-router-dom";
import { storage } from "src/firebase";

export default function CubeProvider({
  children,
  fallbackRoute,
  successRoute,
}: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [customUid, setCustomUid] = useState<string>();
  const navigate = useNavigate();

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

        getJsonDataFromFile((jsonData: any[][]) => {
          const { columns, rows } = getColsAndRows(jsonData);
          setFileResolution({
            columns,
            rows,
            file: { ...fileBlob, name: firstFileRef.name },
            jsonData,
          });
          navigate(successRoute);
          setLoading(false);
        }, fileBlob);
      } else {
        navigate(fallbackRoute, { replace: true });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFile(user.currentUser!.isAdmin ? customUid : user.currentUser!.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customUid]);

  const value: CubeContextType = {
    fileResolution,
    loading,
    setFileResolution,
    customUid,
    setCustomUid,
  };

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
