import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;

  setCustomUid: (uid: string | null) => void;
  customUid: string | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}
