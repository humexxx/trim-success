import { useEffect, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "src/context/hooks";
import { firestore } from "src/lib/firebase";

interface State {
  loading: boolean;
  hasData: boolean;
  /**
   * # of root cube documents we found. 0 = no data, 4 = full
   * pipeline ran (params + base + scorecard + inventoryPerformance).
   */
  docCount: number;
  error: string | null;
}

/**
 * Lightweight read-only "do I already have a cube loaded?" probe.
 *
 * Reads the per-user cube parameters doc directly from Firestore
 * instead of going through CubeProvider. This way ModuleSelector
 * (which lives outside the inventory/sales layouts) can hint at
 * module state without triggering the heavier `getCubeData` call +
 * its redirect-on-error flow.
 *
 * Notably this signal is independent of whether the user uploaded
 * the XLSX through the UI or had Firestore seeded by an admin
 * script — both surface as "has cube data" if the params doc exists.
 */
export function useHasInitialData(): State {
  const { isAdmin, customUser, currentUser } = useAuth();
  const [state, setState] = useState<State>({
    loading: true,
    hasData: false,
    docCount: 0,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function probe() {
      const uid = isAdmin ? customUser?.uid : currentUser?.uid;
      if (!uid) return;

      try {
        // params is the canonical "did initCube finish for this user"
        // marker — it's the first doc the pipeline writes.
        const snap = await getDoc(
          doc(firestore, FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
        );
        if (cancelled) return;
        setState({
          loading: false,
          hasData: snap.exists(),
          docCount: snap.exists() ? 1 : 0,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          loading: false,
          hasData: false,
          docCount: 0,
          error: (e as Error).message,
        });
      }
    }
    probe();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, customUser, currentUser]);

  return state;
}
