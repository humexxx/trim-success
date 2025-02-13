import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";
import { LOCAL_STORAGE_KEYS } from "src/lib/consts";
import { auth } from "src/lib/firebase";

import { getError } from "./error";

export function handleAuthError(error: FirebaseError) {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return "Email already exists";
    case AuthErrorCodes.INVALID_EMAIL:
      return "Invalid email";
    case AuthErrorCodes.WEAK_PASSWORD:
      return "Weak password";
    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      return "Invalid login credentials";
    default:
      return "An error occurred";
  }
}

export async function logout(callback: () => void) {
  try {
    await auth.signOut();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOM_USER);
    callback();
  } catch (error) {
    console.error(getError(error));
  }
}
