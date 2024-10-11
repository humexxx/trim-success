import { doc, getDoc, setDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";
import { IScorecardData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";

export interface UseScorecard {
  loading: boolean;
  get: () => Promise<IScorecardData>;
  update: (data: IScorecardData) => Promise<void>;
  calculate: () => Promise<HttpsCallableResult<ICallableResponse>>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/scorecard`;
}

function useScorecard(): UseScorecard {
  const { currentUser, isAdmin, customUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const get = useCallback(async (): Promise<IScorecardData> => {
    setLoading(true);
    const docRef = doc(
      firestore,
      getDocumentPath(isAdmin ? customUser!.uid : currentUser!.uid)
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
        getDocumentPath(isAdmin ? customUser!.uid : currentUser!.uid)
      );
      await setDoc(docRef, { ...data });
      setLoading(false);
    },
    [currentUser, customUser, isAdmin]
  );

  const calculate = useCallback(async () => {
    setLoading(true);
    const calculateScorecardData = httpsCallable<
      ICallableRequest,
      ICallableResponse
    >(functions, "calculateScorecardData");
    const response = await calculateScorecardData({
      uid: isAdmin ? customUser!.uid : currentUser!.uid,
    });
    setLoading(false);
    return response;
  }, [currentUser, customUser, isAdmin]);

  return { loading, get, update, calculate };
}

export default useScorecard;
