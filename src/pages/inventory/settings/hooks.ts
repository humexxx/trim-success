import { useCallback, useEffect, useState } from "react";

import { IColumn } from "@shared/models";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "src/context/hooks";
import { firestore } from "src/lib/firebase";

interface ISettingsCube {
  columns: IColumn[];
}

/** Narrow `unknown` thrown values to a readable message string. */
function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export function useUserSettingsCube() {
  const [settings, setSettings] = useState<ISettingsCube | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Without an authenticated user there's nothing to fetch — bail
    // out rather than racing the auth context.
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function fetchSettings(uid: string) {
      try {
        const settingsDoc = await getDoc(
          doc(firestore, "settings", "cube", "users", uid)
        );
        if (cancelled) return;
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as ISettingsCube);
        } else {
          throw new Error("Settings not found");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setError(errorMessage(err, "Error fetching settings"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSettings(currentUser.uid);
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid]);

  const updateUserSettings = useCallback(async (columns: IColumn[]) => {
    try {
      const docRef = doc(firestore, "settings", "cube");
      await updateDoc(docRef, { columns });
      setSettings((prev) => ({ ...prev!, columns }));
    } catch (err: unknown) {
      setError(errorMessage(err, "Error updating columns"));
    }
  }, []);

  return { globalSettings: settings, loading, error, updateUserSettings };
}
