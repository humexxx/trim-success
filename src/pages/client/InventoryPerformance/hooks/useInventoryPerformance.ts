import { useCallback, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { IInventoryPerformanceData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "src/context/auth";
import { firestore, functions } from "src/firebase";
import { getError } from "src/utils";

export interface UseInventoryPerformance {
  get: () => Promise<IInventoryPerformanceData>;
  calculateInventoryPerformance: () => Promise<HttpsCallableResult<ICallableResponse> | null>;
  calculateDataModelInventoryPerformance: () => Promise<HttpsCallableResult<ICallableResponse> | null>;
  loading: boolean;
  error: string | null;
}

function useInventoryPerformance(): UseInventoryPerformance {
  const { currentUser, isAdmin, customUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async (): Promise<IInventoryPerformanceData> => {
    setLoading(true);

    const docRef = doc(
      firestore,
      FIRESTORE_PATHS.SETTINGS.INVENTORY_PERFORMANCE(
        isAdmin ? customUser!.uid : currentUser!.uid
      )
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

  const calculateInventoryPerformance = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const calculateInventoryPerformance = httpsCallable<
        ICallableRequest,
        ICallableResponse
      >(functions, "calculateInventoryPerformance");
      const response = await calculateInventoryPerformance({
        uid: isAdmin ? customUser!.uid! : currentUser!.uid,
      });
      setLoading(false);
      return response;
    } catch (error) {
      setError(getError(error));
      setLoading(false);
      return null;
    }
  }, [currentUser, customUser, isAdmin]);

  const calculateDataModelInventoryPerformance = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const calculateDataModelInventoryPerformance = httpsCallable<
        ICallableRequest,
        ICallableResponse
      >(functions, "calculateDataModelInventoryPerformance");
      const response = await calculateDataModelInventoryPerformance({
        uid: isAdmin ? customUser!.uid! : currentUser!.uid,
      });
      setLoading(false);
      return response;
    } catch (error) {
      setError(getError(error));
      setLoading(false);
      return null;
    }
  }, [currentUser, customUser, isAdmin]);

  return {
    get,
    calculateInventoryPerformance,
    calculateDataModelInventoryPerformance,
    loading,
    error,
  };
}

export default useInventoryPerformance;
