import { sendPasswordResetEmail } from "firebase/auth";
import { AutoLogRoute } from "src/components";
import { useDocumentMetadata } from "src/hooks";
import { auth } from "src/lib/firebase";
import { getError } from "src/utils";

import ForgotPassword from "./components";
import { ForgotPasswordFormInputs } from "./components/ForgotPassword";

async function handleOnSubmit(form: ForgotPasswordFormInputs) {
  try {
    await sendPasswordResetEmail(auth, form.email);
  } catch (error) {
    throw new Error(getError(error));
  }
}

const Page = () => {
  useDocumentMetadata("Contraseña Olvidada - Trim Success");
  return (
    <AutoLogRoute>
      <ForgotPassword handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default Page;
