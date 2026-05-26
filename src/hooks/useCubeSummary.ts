import { useEffect, useState } from "react";

import { FIRESTORE_PATHS } from "@shared/consts";
import { EDriverType } from "@shared/enums";
import type { IBaseData, ICubeParameters } from "@shared/models";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "src/context/hooks";
import { firestore } from "src/lib/firebase";

interface Summary {
  totalSales: number;
  totalGrossMargin: number;
  totalSkus: number;
  categoryCount: number;
  grossMarginPct: number;
}

interface State {
  loading: boolean;
  hasData: boolean;
  summary: Summary | null;
  error: string | null;
}

/**
 * Lightweight read-only probe that gives ModuleSelector real metrics
 * to surface inside each module card. Reads only the params + base
 * Firestore docs directly (no Cloud Function call), so it stays cheap
 * and avoids triggering CubeProvider's redirect-on-error flow.
 *
 * Returns `hasData: false` if either doc is missing, which is the same
 * signal useHasInitialData used to provide.
 */
export function useCubeSummary(): State {
  const { isAdmin, customUser, currentUser } = useAuth();
  // Resolve the effective uid OUTSIDE the effect so the dep array can
  // narrow to a single primitive — depending on the full user objects
  // would re-fire the probe whenever any unrelated user field changes
  // (e.g. token refresh swaps the object identity).
  const uid = isAdmin ? customUser?.uid : currentUser?.uid;
  const [state, setState] = useState<State>({
    loading: true,
    hasData: false,
    summary: null,
    error: null,
  });

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    async function probe(_uid: string) {
      try {
        const [paramsSnap, baseSnap] = await Promise.all([
          getDoc(doc(firestore, FIRESTORE_PATHS.SETTINGS.PARAMS(_uid))),
          getDoc(doc(firestore, FIRESTORE_PATHS.SETTINGS.BASE(_uid))),
        ]);
        if (cancelled) return;

        if (!paramsSnap.exists() || !baseSnap.exists()) {
          setState({
            loading: false,
            hasData: false,
            summary: null,
            error: null,
          });
          return;
        }

        const params = paramsSnap.data() as ICubeParameters;
        const base = baseSnap.data() as IBaseData;
        const totals = base.categoriesData?.totals ?? {};

        const totalSales = Number(totals[EDriverType.SALES] ?? 0);
        const totalGrossMargin = Number(totals[EDriverType.GROSS_MARGIN] ?? 0);
        const totalSkus = Number(totals[EDriverType.SKUS] ?? 0);

        setState({
          loading: false,
          hasData: true,
          summary: {
            totalSales,
            totalGrossMargin,
            totalSkus,
            categoryCount: params.categories?.length ?? 0,
            grossMarginPct: totalSales > 0 ? totalGrossMargin / totalSales : 0,
          },
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          loading: false,
          hasData: false,
          summary: null,
          error: (e as Error).message,
        });
      }
    }
    probe(uid);
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return state;
}
