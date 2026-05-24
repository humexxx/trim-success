import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AutoLogRoute } from "src/components";
import { useDocumentMetadata } from "src/hooks";
import { ROUTES } from "src/lib/consts";
import { auth } from "src/lib/firebase";
import { getError } from "src/utils";

import SignIn from "./components";
import { SignInFormInputs } from "./components/SignIn";

const SignInPage = () => {
  useDocumentMetadata(
    "Iniciar sesión",
    "Accede a tu cuenta para ver scorecards, drivers y rendimiento de tu inventario."
  );
  const navigate = useNavigate();

  async function handleOnSubmit(form: SignInFormInputs) {
    try {
      await setPersistence(
        auth,
        form.persist ? browserLocalPersistence : browserSessionPersistence
      );
      const credential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      // Read the admin claim directly off the fresh token so we route
      // before AuthContext finishes its own onAuthStateChanged pass —
      // otherwise admins would briefly land on /module-selector first.
      const token = await credential.user.getIdTokenResult();
      const isAdmin = Boolean(token.claims.admin);
      navigate(
        isAdmin ? ROUTES.INVENTORY.ADMIN.IMPERSONATE : ROUTES.MODULE_SELECTOR
      );
    } catch (error) {
      throw new Error(getError(error));
    }
  }

  return (
    <AutoLogRoute>
      <SignIn handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default SignInPage;
