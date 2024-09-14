import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { IScorecardData } from "src/models/user";

export interface UseScorecardData {
  data: IScorecardData | null;
  loading: boolean;
  error: string | null;
  updateData: (data: IScorecardData) => Promise<void>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/scorecardData`;
}

function useScorecardData(
  {
    initialData,
    userId,
  }: {
    initialData: IScorecardData | null;
    userId?: string;
  } = {
    initialData: null,
    userId: undefined,
  }
): UseScorecardData {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IScorecardData | null>(initialData);
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
          setData(docSnap.data() as IScorecardData);
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

  const updateData = useCallback(
    async (data: IScorecardData) => {
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

  return { data, loading, error, updateData };
}

export default useScorecardData;
