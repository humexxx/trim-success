import { useCallback, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { IParamsData } from "@shared/models";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "src/context/hooks";
import { firestore } from "src/firebase";

export interface UseParamsData {
  update: (data: IParamsData) => Promise<void>;
  loading: boolean;
  error: string | null;
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
          FIRESTORE_PATHS.SETTINGS.PARAMS(
            isAdmin ? customUser!.uid : currentUser!.uid
          )
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
