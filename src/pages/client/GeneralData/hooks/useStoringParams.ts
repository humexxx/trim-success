import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { IStoringParams } from "src/models/user";
import { firestore } from "src/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UseStoringParams {
  data: IStoringParams | null;
  loading: boolean;
  error: string | null;
  updateStoringParams: (data: IStoringParams) => Promise<void>;
}

function useStoringParams(): UseStoringParams {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IStoringParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(
          firestore,
          `settings/${currentUser!.uid}/params/storing`
        );
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as IStoringParams);
        }
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      setLoading(true);
      fetchData();
    }
  }, [currentUser]);

  const updateStoringParams = useCallback(
    async (data: IStoringParams) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          `settings/${currentUser!.uid}/params/storing`
        );
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

  return { data, loading, error, updateStoringParams };
}

export default useStoringParams;
