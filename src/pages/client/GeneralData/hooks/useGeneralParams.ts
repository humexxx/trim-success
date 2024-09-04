import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/context/auth";
import { useCube } from "src/context/cube";
import { firestore } from "src/firebase";
import { IGeneralParams } from "src/models/user";
import { getSumCostSalesAsync, getSumSalesAsync } from "src/utils";

interface UseGeneralParams {
  data: IGeneralParams | null;
  loading: boolean;
  error: string | null;
  updateGeneralParams: (data: IGeneralParams) => Promise<void>;
}

function useGeneralParams(): UseGeneralParams {
  const { currentUser } = useAuth();
  const { fileResolution } = useCube();
  const [data, setData] = useState<IGeneralParams | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = doc(
          firestore,
          `settings/${currentUser!.uid}/params/general`
        );
        const docSnap = await getDoc(snapshot);
        if (docSnap.exists()) {
          setData(docSnap.data() as IGeneralParams);
        }
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    async function calculateData() {
      const sales = await getSumSalesAsync(fileResolution?.rows);
      const salesCost = await getSumCostSalesAsync(fileResolution?.rows);

      setData({
        financial: {
          sales,
          salesCost,
          companyCapitalCost: 0,
          inventoryAnnualCost: 0,
          technologyCapitalCost: 0,
        },
        operational: {
          annualWorkingHours: 0,
        },
      });

      setLoading(false);
    }

    if (fileResolution && !loading && !data) {
      setLoading(true);
      calculateData();
    }
  }, [data, fileResolution, loading]);

  const updateGeneralParams = useCallback(
    async (data: IGeneralParams) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          `settings/${currentUser!.uid}/params/general`
        );
        await setDoc(docRef, { ...data });
        setData(data);
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  return { data, loading, error, updateGeneralParams };
}

export default useGeneralParams;
