import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "src/firebase";
import AuthContext from "./AuthContext";
import { AuthContextType, AuthProviderProps } from "./AuthContext.types";

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customUid, setCustomUid] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAdmin,

    setCustomUid,
    customUid,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
