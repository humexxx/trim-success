import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';

export function handleAuthError(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw new Error('Email already exists');
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error('Invalid email');
      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error('Weak password');
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        throw new Error('Invalid login credentials');
      default:
        throw new Error('An error occurred');
    }
  }
  throw error;
}
