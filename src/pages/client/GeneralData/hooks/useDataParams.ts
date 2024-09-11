import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { IDataParams } from "src/models/user";

export interface UseDataParams {
  data: IDataParams | null;
  loading: boolean;
  error: string | null;
  updateDataParams: (data: IDataParams) => Promise<void>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/params`;
}

function useDataParams({ autoload } = { autoload: true }): UseDataParams {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IDataParams | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(firestore, getDocumentPath(currentUser!.uid));
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as IDataParams);
        }
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    }

    if (currentUser && autoload) {
      fetchData();
    }
  }, [currentUser]);

  const updateDataParams = useCallback(
    async (data: IDataParams) => {
      setLoading(true);
      try {
        const docRef = doc(firestore, getDocumentPath(currentUser!.uid));
        await setDoc(docRef, { ...data });
        setData(data);
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  return { data, loading, error, updateDataParams };
}

export default useDataParams;
