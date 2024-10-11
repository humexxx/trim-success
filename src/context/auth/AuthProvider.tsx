import { useEffect, useState } from "react";

import { IUser } from "@shared/models";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "src/firebase";

import AuthContext from "./AuthContext";
import { AuthContextType, AuthProviderProps } from "./AuthContext.types";

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customUser, setCustomUser] = useState<IUser | null>(null);
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

    customUser,
    setCustomUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
