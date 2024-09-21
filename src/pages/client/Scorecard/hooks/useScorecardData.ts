import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuth } from "src/context/auth";
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
      } catch (error: any) {
        setError(error.message ?? error.toString());
      } finally {
        setLoading(false);
      }
    },
    [currentUser, customUser, isAdmin]
  );

  return { loading, error, update };
}

export default useScorecardData;
