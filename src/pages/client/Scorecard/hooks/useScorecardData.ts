import { doc, setDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";
import { IScorecardData } from "src/models";
import { getError } from "src/utils";

export interface UseScorecardData {
  loading: boolean;
  error: string | null;
  update: (data: IScorecardData) => Promise<void>;
  calculate: () => Promise<HttpsCallableResult<unknown>>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/scorecard`;
}

function useScorecardData(): UseScorecardData {
  const { currentUser, isAdmin, customUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IScorecardData) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          getDocumentPath(isAdmin ? customUser!.uid : currentUser!.uid)
        );
        await setDoc(docRef, { ...data });
      } catch (error) {
        setError(getError(error));
      } finally {
        setLoading(false);
      }
    },
    [currentUser, customUser, isAdmin]
  );

  const calculate = useCallback(async () => {
    setLoading(true);
    const createScorecardData = httpsCallable(functions, "createScorecardData");
    const response = await createScorecardData({
      uid: isAdmin ? customUser!.uid : currentUser!.uid,
    });
    setLoading(false);
    return response;
  }, [currentUser, customUser, isAdmin]);

  return { loading, error, update, calculate };
}

export default useScorecardData;
