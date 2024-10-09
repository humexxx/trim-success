import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";
import { IParamsData } from "@shared/models";

export interface UseParamsData {
  update: (data: IParamsData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/params`;
}

function useParamsData(): UseParamsData {
  const { currentUser, customUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IParamsData) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          getDocumentPath(isAdmin ? customUser!.uid : currentUser!.uid)
        );
        await setDoc(docRef, { ...data });
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [currentUser, customUser, isAdmin]
  );

  return { update, loading, error };
}

export default useParamsData;
