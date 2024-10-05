import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { AutoLogRoute } from "src/components";
import { useNavigate } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";
import { auth } from "src/firebase";
import SignIn from "./components";
import { SignInFormInputs } from "./components/SignIn";
import { getError } from "src/utils";

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
