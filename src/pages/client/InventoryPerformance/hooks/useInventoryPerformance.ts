import { useCallback, useState } from "react";

import { IInventoryPerformanceData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";

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
    const response = await calculateInventoryPerformance();
    setLoading(false);
    return response;
  }, []);

  return { get, calculate, loading };
}

export default useInventoryPerformance;
