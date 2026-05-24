import { AdminGuard } from "src/components";
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";

import { AdminClientSelector } from "./components";

export default function Page() {
  return (
    <AdminGuard>
      <PageWrapper
        title="Impersonar usuario"
        description="Asume la sesión de un usuario para inspeccionar su cubo desde admin."
      >
        <PageHeader
          title="Impersonar usuario"
          description="Selecciona un usuario para ver sus datos como si estuvieras conectado con su cuenta. Tus acciones aplican sobre su cubo."
        />
        <PageContent>
          <AdminClientSelector />
        </PageContent>
      </PageWrapper>
    </AdminGuard>
  );
}
