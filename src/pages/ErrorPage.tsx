import { ErrorResponse, useRouteError } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";

function ErrorPage() {
  useDocumentMetadata("Error - Trim Success");
  const error = useRouteError() as ErrorResponse;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.data}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
