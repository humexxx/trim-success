import { useCallback, useState } from "react";

import {
  ICallableRequest,
  ICallableResponse,
} from "@shared/models/functions";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { functions } from "src/lib/firebase";

export interface UseReportsGenerator {
  generateGeneralReport: () => Promise<ICallableResponse<string>>;
  loading: boolean;
}

/**
 * Thin Cloud Function wrapper for report generation. Returns the
 * already-typed `ICallableResponse<string>` (the backend hands back a
 * JSON-stringified report doc) so callers don't need any `as any`
 * casts on the response.
 */
function useReportsGenerator(): UseReportsGenerator {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser, isAdmin, customUser } = useAuth();

  const generateGeneralReport = useCallback(async () => {
    setLoading(true);
    try {
      const fn = httpsCallable<ICallableRequest, ICallableResponse<string>>(
        functions,
        "generateGeneralReport"
      );
      const response = await fn({
        uid: isAdmin ? customUser!.uid : currentUser!.uid,
      });
      return response.data;
    } finally {
      // Always reset loading even if the callable throws — otherwise
      // a failed report leaves the spinner running forever.
      setLoading(false);
    }
  }, [currentUser, customUser, isAdmin]);

  return { generateGeneralReport, loading };
}

export default useReportsGenerator;
