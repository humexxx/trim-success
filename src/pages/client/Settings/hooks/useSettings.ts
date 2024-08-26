import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ISettingsCube } from "src/models";
import { firestore } from "src/firebase";

export function useSettingsCube() {
  const [settings, setSettings] = useState<ISettingsCube | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(firestore, "settings", "cube"));
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

  return { settings, loading, error };
}
