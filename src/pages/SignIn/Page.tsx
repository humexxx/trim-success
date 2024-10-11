import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AutoLogRoute } from "src/components";
import { auth } from "src/firebase";
import { useDocumentMetadata } from "src/hooks";
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
          navigate("/client/dashboard");
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
