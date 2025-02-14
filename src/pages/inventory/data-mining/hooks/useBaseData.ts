import { useCallback, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { IBaseData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { doc, setDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { firestore, functions } from "src/lib/firebase";
import { getError } from "src/utils";

export interface UseBaseData {
  loading: boolean;
  error: string | null;
  update: (data: IBaseData) => Promise<void>;
  calculate: () => Promise<HttpsCallableResult<ICallableResponse> | null>;
}

function useBaseData(): UseBaseData {
  const { currentUser, customUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IBaseData) => {
      setError(null);
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          FIRESTORE_PATHS.SETTINGS.BASE(
            isAdmin ? customUser!.uid! : currentUser!.uid
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

  const calculate = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const calculateDataMining = httpsCallable<
        ICallableRequest,
        ICallableResponse
      >(functions, "calculateDataMining");
      const response = await calculateDataMining({
        uid: isAdmin ? customUser!.uid! : currentUser!.uid,
      });
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      setError(getError(error));
      return null;
    }
  }, [currentUser, customUser, isAdmin]);

  return { loading, error, update, calculate };
}

export default useBaseData;
