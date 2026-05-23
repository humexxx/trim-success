import { Link, type ErrorResponse, useRouteError } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";

import { Button } from "@/components/ui/button";

function ErrorPage() {
  useDocumentMetadata(
    "Error",
    "Algo salió mal. Vuelve al inicio o intenta de nuevo en unos minutos."
  );
  const error = useRouteError() as ErrorResponse;
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold">Oops!</h1>
        <p className="text-muted-foreground">
          Ocurrió un error inesperado.
        </p>
        {(error?.statusText || error?.data) && (
          <p className="italic text-muted-foreground">
            {error.statusText || error.data}
          </p>
        )}
      </div>
      <Link to="/">
        <Button variant="outline">Volver al inicio</Button>
      </Link>
    </div>
  );
}

export default ErrorPage;
