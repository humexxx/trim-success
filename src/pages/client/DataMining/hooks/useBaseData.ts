import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";
import { IBaseData } from "@shared/models";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";

export interface UseBaseData {
  loading: boolean;
  error: string | null;
  update: (data: IBaseData) => Promise<void>;
  calculate: () => Promise<HttpsCallableResult<ICallableResponse>>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/base`;
}

function useBaseData(): UseBaseData {
  const { currentUser, customUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IBaseData) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          getDocumentPath(isAdmin ? customUser!.uid! : currentUser!.uid)
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
    setLoading(true);
    const calculateDataMining = httpsCallable<
      ICallableRequest,
      ICallableResponse
    >(functions, "calculateDataMining");
    const response = await calculateDataMining({
      uid: isAdmin ? customUser!.uid : currentUser!.uid,
    });
    setLoading(false);
    return response;
  }, [currentUser, customUser, isAdmin]);

  return { loading, error, update, calculate };
}

export default useBaseData;
