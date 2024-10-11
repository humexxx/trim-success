import { doc, getDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";
import { IInventoryPerformanceData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";

export interface UseInventoryPerformance {
  get: () => Promise<IInventoryPerformanceData>;
  calculate: () => Promise<HttpsCallableResult<ICallableResponse>>;
  loading: boolean;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/inventoryPerformance`;
}

function useInventoryPerformance(): UseInventoryPerformance {
  const { currentUser, isAdmin, customUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const get = useCallback(async (): Promise<IInventoryPerformanceData> => {
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
    const data = snap.data() as IInventoryPerformanceData;
    setLoading(false);
    return data;
  }, [currentUser, customUser, isAdmin]);

  const calculate = useCallback(async () => {
    setLoading(true);
    const calculateInventoryPerformance = httpsCallable<
      ICallableRequest,
      ICallableResponse
    >(functions, "calculateInventoryPerformance");
    const response = await calculateInventoryPerformance({
      uid: isAdmin ? customUser!.uid : currentUser!.uid,
    });
    setLoading(false);
    return response;
  }, [currentUser, customUser, isAdmin]);

  return { get, calculate, loading };
}

export default useInventoryPerformance;
