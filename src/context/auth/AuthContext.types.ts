import { User } from "firebase/auth";
import { ReactNode } from "react";
import { IUser } from "@shared/models";

export interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;

  setCustomUser: (user: IUser | null) => void;
  customUser: IUser | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}
