import { useState, useEffect, useCallback } from "react";

import { IColumn } from "@shared/models";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "src/context/auth";
import { firestore } from "src/firebase";

interface ISettingsCube {
  columns: IColumn[];
}

export function useUserSettingsCube() {
  const [settings, setSettings] = useState<ISettingsCube | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(
          doc(firestore, "settings", "cube", "users", user.currentUser!.uid)
        );
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as ISettingsCube);
        } else {
          throw new Error("Settings not found");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateUserSettings = useCallback(async (columns: IColumn[]) => {
    try {
      const docRef = doc(firestore, "settings", "cube");
      await updateDoc(docRef, { columns });
      setSettings((prev) => ({ ...prev!, columns }));
    } catch (err: any) {
      setError(err.message || "Error updating columns");
    }
  }, []);

  return { globalSettings: settings, loading, error, updateUserSettings };
}
