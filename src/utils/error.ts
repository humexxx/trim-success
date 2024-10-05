import { FirebaseError } from "firebase/app";
import { handleAuthError } from "./auth";

export function getError(error: unknown): string {
  if (error instanceof FirebaseError)
    return handleAuthError(error as FirebaseError);
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}
