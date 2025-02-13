import { useCallback, useState } from "react";

import { httpsCallable } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { functions } from "src/lib/firebase";

export interface UseReportsGenerator {
  generateGeneralReport: () => Promise<unknown>;
  loading: boolean;
}

function useReportsGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser, isAdmin, customUser } = useAuth();

  const generateGeneralReport = useCallback(async () => {
    setLoading(true);
    const _generateGeneralReport = httpsCallable(
      functions,
      "generateGeneralReport"
    );
    const response = await _generateGeneralReport({
      uid: isAdmin ? customUser!.uid : currentUser!.uid,
    });
    setLoading(false);
    return response;
  }, [currentUser, customUser, isAdmin]);

  return { generateGeneralReport, loading };
}

export default useReportsGenerator;
