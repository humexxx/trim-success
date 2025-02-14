import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AutoLogRoute } from "src/components";
import { useDocumentMetadata } from "src/hooks";
import { ROUTES } from "src/lib/consts";
import { auth } from "src/lib/firebase";
import { getError } from "src/utils";

import SignUp from "./components";
import { SignUpFormInputs } from "./components/SignUp";

const Page = () => {
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
        navigate(ROUTES.MODULE_SELECTOR);
      });
    } catch (error) {
      throw new Error(getError(error));
    }
  }

  return (
    <AutoLogRoute>
      <SignUp handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default Page;
