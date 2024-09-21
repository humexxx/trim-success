import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { firestore } from "src/firebase";
import { IBaseData } from "src/models";

export interface UseBaseData {
  loading: boolean;
  error: string | null;
  update: (data: IBaseData) => Promise<void>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/base`;
}

function useBaseData(uid: string): UseBaseData {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IBaseData) => {
      setLoading(true);
      try {
        const docRef = doc(firestore, getDocumentPath(uid));
        await setDoc(docRef, { ...data });
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  return { loading, error, update };
}

export default useBaseData;
