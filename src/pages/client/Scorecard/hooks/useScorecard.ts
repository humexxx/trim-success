import { useCallback, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { IScorecardData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { firestore, functions } from "src/firebase";
import { getError } from "src/utils";

export interface UseScorecard {
  loading: boolean;
  get: () => Promise<IScorecardData>;
  update: (data: IScorecardData) => Promise<void>;
  calculate: () => Promise<ICallableResponse>;
  error: string | null;
}

function useScorecard(): UseScorecard {
  const { currentUser, isAdmin, customUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async (): Promise<IScorecardData> => {
    setLoading(true);
    const docRef = doc(
      firestore,
      FIRESTORE_PATHS.SETTINGS.SCORECARD(
        isAdmin ? customUser!.uid : currentUser!.uid
      )
    );
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      setLoading(false);
      throw new Error("No data found");
    }
    const data = snap.data() as IScorecardData;
    setLoading(false);
    return data;
  }, [currentUser, customUser, isAdmin]);

  const update = useCallback(
    async (data: IScorecardData) => {
      setLoading(true);
      const docRef = doc(
        firestore,
        FIRESTORE_PATHS.SETTINGS.SCORECARD(
          isAdmin ? customUser!.uid : currentUser!.uid
        )
      );
      await setDoc(docRef, { ...data });
      setLoading(false);
    },
    [currentUser, customUser, isAdmin]
  );

  const calculate = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const calculateScorecardData = httpsCallable<
        ICallableRequest,
        ICallableResponse
      >(functions, "calculateScorecardData");
      const response = await calculateScorecardData({
        uid: isAdmin ? customUser!.uid! : currentUser!.uid,
      });
      setLoading(false);
      return response.data;
    } catch (e) {
      const error = getError(e);
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  }, [currentUser, customUser, isAdmin]);

  return { loading, get, update, calculate, error };
}

export default useScorecard;
