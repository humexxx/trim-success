import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from "firebase/auth";
import { auth } from "../firebase";
import SignUp, { SignUpFormInputs } from "src/components/pages/sign-up";
import { useNavigate } from "react-router-dom";
import { AutoLogRoute } from "src/components/common";
import { handleAuthError } from "src/utils/auth";
import { useDocumentMetadata } from "src/hooks";

const SignUpPage = () => {
  useDocumentMetadata("Sign Up - Trim Success");
  const navigate = useNavigate();

  async function handleOnSubmit(form: SignUpFormInputs) {
    try {
      await setPersistence(
        auth,
        form.persist ? browserLocalPersistence : browserSessionPersistence
      );
      await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      ).then(() => {
        navigate("/client/dashboard");
      });
    } catch (error) {
      handleAuthError(error);
    }
  }

  return (
    <AutoLogRoute>
      <SignUp handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default SignUpPage;
