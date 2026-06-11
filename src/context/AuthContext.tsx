import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { IUser } from "@shared/models";
import { User, onAuthStateChanged } from "firebase/auth";
import { LOCAL_STORAGE_KEYS } from "src/lib/consts";
import { auth } from "src/lib/firebase";

export interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;

  setCustomUser: (user: IUser | null) => void;
  customUser: IUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

interface Props {
  children: ReactNode;
}

/** Hydrate `customUser` from localStorage exactly once on first render
 * so an admin who refreshes mid-impersonation keeps the same context. */
function readPersistedCustomUser(): IUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_USER);
    return raw ? (JSON.parse(raw) as IUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customUser, setCustomUserState] = useState<IUser | null>(
    readPersistedCustomUser
  );
  const [isAdmin, setIsAdmin] = useState(false);

  // Single setter so React state and localStorage never diverge.
  // Persisting through this is what lets a hard refresh resume the
  // current impersonation; calling with `null` clears both.
  const setCustomUser = useCallback((user: IUser | null) => {
    setCustomUserState(user);
    try {
      if (user)
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CUSTOM_USER,
          JSON.stringify(user)
        );
      else localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOM_USER);
    } catch {
      // Storage may be unavailable in private mode — silently ignore.
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        user.getIdTokenResult().then((token) => {
          setIsAdmin(Boolean(token.claims.admin));
          setLoading(false);
        });
      } else {
        setCurrentUser(user);
        // Without this, a non-admin logging in right after an admin
        // logged out would briefly inherit the stale `isAdmin: true`.
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Same rationale as CubeContext: a fresh object every render would
  // force every useAuth() consumer to re-render even when nothing
  // auth-related changed.
  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      isAdmin,

      customUser,
      setCustomUser,
    }),
    [currentUser, isAdmin, customUser, setCustomUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
