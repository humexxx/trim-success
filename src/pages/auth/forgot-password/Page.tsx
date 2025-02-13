import { sendPasswordResetEmail } from "firebase/auth";
import { AutoLogRoute } from "src/components";
import { useDocumentMetadata } from "src/hooks";
import { auth } from "src/lib/firebase";

import ForgotPassword from "./components";
import { ForgotPasswordFormInputs } from "./components/ForgotPassword";

async function handleOnSubmit(form: ForgotPasswordFormInputs) {
  await sendPasswordResetEmail(auth, form.email)
    .then(() => {
      console.log("Password reset email sent");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
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
