import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { IParams } from "src/models/user";

export interface UseDataParams {
  data: IParams | null;
  loading: boolean;
  error: string | null;
  updateDataParams: (data: IParams) => Promise<void>;
  updateMemoryDataParams: (data: IParams) => void;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/params`;
}

function useDataParams(): UseDataParams {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IParams | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(firestore, getDocumentPath(currentUser!.uid));
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as IParams);
        }
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const updateDataParams = useCallback(
    async (data: IParams) => {
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

  const updateMemoryDataParams = useCallback((data: IParams) => {
    setData(data);
  }, []);

  return { data, loading, error, updateDataParams, updateMemoryDataParams };
}

export default useDataParams;
