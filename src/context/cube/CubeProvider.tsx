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

export default function CubeProvider({ children }: CubeProviderProps) {
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const folderRef = ref(
        storage,
        `${STORAGE_PATH}/${user.currentUser!.uid}/`
      );

      try {
        const result = await listAll(folderRef);
        if (result.items.length > 0) {
          const firstFileRef = result.items[0];
          const fileBlob = await getBlob(firstFileRef);
          // const downloadURL = await getDownloadURL(firstFileRef);

          getJsonDataFromFile((jsonData: any[][]) => {
            const { columns, rows } = getColsAndRows(jsonData);
            setFileResolution({
              columns,
              rows,
              file: { ...fileBlob, name: firstFileRef.name },
              jsonData,
            });
            setLoading(false);
          }, fileBlob);
        } else {
          navigate("/client/import", { replace: true });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    })();
  }, [user.currentUser]);

  const value: CubeContextType = {
    fileResolution,
    loading,
    setFileResolution,
  };

  return <CubeContext.Provider value={value}>{children}</CubeContext.Provider>;
}
