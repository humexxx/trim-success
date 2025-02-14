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
  useDocumentMetadata("Sign In - Trim Success");
  const navigate = useNavigate();

  async function handleOnSubmit(form: SignInFormInputs) {
    try {
      await setPersistence(
        auth,
        form.persist ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, form.email, form.password).then(
        () => {
          navigate(ROUTES.MODULE_SELECTOR);
        }
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
