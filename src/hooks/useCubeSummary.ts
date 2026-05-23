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
  const [state, setState] = useState<State>({
    loading: true,
    hasData: false,
    summary: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function probe() {
      const uid = isAdmin ? customUser?.uid : currentUser?.uid;
      if (!uid) return;

      try {
        const [paramsSnap, baseSnap] = await Promise.all([
          getDoc(doc(firestore, FIRESTORE_PATHS.SETTINGS.PARAMS(uid))),
          getDoc(doc(firestore, FIRESTORE_PATHS.SETTINGS.BASE(uid))),
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
    probe();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, customUser, currentUser]);

  return state;
}
