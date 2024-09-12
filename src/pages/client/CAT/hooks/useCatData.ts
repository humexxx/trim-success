import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { ICatData } from "src/models/user";

export interface UseCatData {
  data: ICatData | null;
  loading: boolean;
  error: string | null;
  updateCatData: (data: ICatData) => Promise<void>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/catData`;
}

function useDataParams(
  {
    initialData,
    userId,
  }: {
    initialData: ICatData | null;
    userId?: string;
  } = {
    initialData: null,
    userId: undefined,
  }
): UseCatData {
  const { currentUser } = useAuth();
  const [data, setData] = useState<ICatData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(
          firestore,
          getDocumentPath(userId ?? currentUser!.uid)
        );
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as ICatData);
        }
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    }

    if (!initialData && !data) {
      fetchData();
    }
  }, [currentUser, data, initialData, userId]);

  const updateCatData = useCallback(
    async (data: ICatData) => {
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

  return { data, loading, error, updateCatData };
}

export default useDataParams;
