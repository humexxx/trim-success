import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { AutoLogRoute } from "src/components/common";
import ForgotPassword, {
  ForgotPasswordFormInputs,
} from "src/components/pages/forgot-password";
import { useDocumentMetadata } from "src/hooks";

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

const ForgotPasswordPage = () => {
  useDocumentMetadata("Contraseña Olvidada - Trim Success");
  return (
    <AutoLogRoute>
      <ForgotPassword handleOnSubmit={handleOnSubmit} />
    </AutoLogRoute>
  );
};

export default ForgotPasswordPage;
