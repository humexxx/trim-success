import { useEffect, useState } from "react";

import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import { IFileData } from "@shared/models";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "src/context/hooks";
import { functions } from "src/lib/firebase";

interface State {
  loading: boolean;
  hasData: boolean;
  fileCount: number;
  error: string | null;
}

/**
 * Lightweight read-only "do I already have a cube loaded?" probe.
 *
 * Bypasses CubeProvider on purpose so ModuleSelector — which lives
 * outside the inventory/sales layouts — can hint at module state
 * without triggering the heavier load + redirect-on-error flow that
 * CubeProvider runs on mount.
 */
export function useHasInitialData(): State {
  const { isAdmin, customUser, currentUser } = useAuth();
  const [state, setState] = useState<State>({
    loading: true,
    hasData: false,
    fileCount: 0,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const uid = isAdmin ? customUser?.uid : currentUser?.uid;
      if (!uid) return;

      try {
        const call = httpsCallable<
          ICallableRequest,
          ICallableResponse<IFileData[]>
        >(functions, "getFiles");
        const res = await call({ uid });
        const files = res.data.success ? (res.data.data ?? []) : [];
        if (cancelled) return;
        setState({
          loading: false,
          hasData: files.length > 0,
          fileCount: files.length,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          loading: false,
          hasData: false,
          fileCount: 0,
          error: (e as Error).message,
        });
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, customUser, currentUser]);

  return state;
}
