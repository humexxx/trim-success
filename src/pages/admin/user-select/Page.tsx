import { AdminGuard } from "src/components";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useDocumentMetadata } from "src/hooks";

import { AdminClientSelector } from "./components";

export default function Page() {
  useDocumentMetadata("Seleccionar Usuario - Trim Success");

  return (
    <AdminGuard>
      <PageWrapper title="Seleccionar Usuario">
        <PageHeader
          title="Cargar Archivo de Usuario"
          description="Como eres administrador, puedes cargar un archivo de usuario"
        />
        <PageContent>
          <div className="max-w-md">
            <AdminClientSelector />
          </div>
        </PageContent>
      </PageWrapper>
    </AdminGuard>
  );
}
