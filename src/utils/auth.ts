import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

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
