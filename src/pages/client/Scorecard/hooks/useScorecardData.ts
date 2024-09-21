import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { firestore } from "src/firebase";
import { IScorecardData } from "src/models";

export interface UseScorecardData {
  loading: boolean;
  error: string | null;
  update: (data: IScorecardData) => Promise<void>;
}

function getDocumentPath(uid: string) {
  return `settings/${uid}/data/scorecard`;
}

function useScorecardData(uid: string): UseScorecardData {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IScorecardData) => {
      setLoading(true);
      try {
        const docRef = doc(firestore, getDocumentPath(uid));
        await setDoc(docRef, { ...data });
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  return { loading, error, update };
}

export default useScorecardData;
