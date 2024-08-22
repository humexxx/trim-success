import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { AutoLogRoute } from "src/components/common";
import { useNavigate } from "react-router-dom";
import { handleAuthError } from "src/utils/auth";
import { useDocumentMetadata } from "src/hooks";
import { auth } from "src/firebase";
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
      handleAuthError(error);
    }
  }

  return (
    <AutoLogRoute>
      <SignIn handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default SignInPage;
