import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { firestore } from "src/firebase";
import { IParamsData } from "src/models";

export interface UseDataParams {
  update: (data: IParamsData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/params`;
}

function useDataParams(uid: string): UseDataParams {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IParamsData) => {
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

  return { update, loading, error };
}

export default useDataParams;
