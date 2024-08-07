import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface AuthContextType {
  currentUser: (User & { isAdmin?: boolean }) | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}
