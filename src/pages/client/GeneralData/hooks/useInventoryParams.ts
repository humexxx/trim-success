import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { IInventoryParams } from "src/models/user";

interface UseInventoryParams {
  data: IInventoryParams | null;
  loading: boolean;
  error: string | null;
  updateInventoryParams: (data: IInventoryParams) => Promise<void>;
}

function useInventoryParams(): UseInventoryParams {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IInventoryParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(
          firestore,
          `settings/${currentUser!.uid}/params/inventory`
        );
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as IInventoryParams);
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

  const updateInventoryParams = useCallback(
    async (data: IInventoryParams) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          `settings/${currentUser!.uid}/params/inventory`
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

  return { data, loading, error, updateInventoryParams };
}

export default useInventoryParams;
