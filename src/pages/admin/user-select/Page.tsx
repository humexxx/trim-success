import { Box } from "@mui/material";
import { AdminGuard } from "src/components";
import { PageHeader, PageContent, PageWrapper } from "src/components/layout";
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
          <Box maxWidth={450}>
            <AdminClientSelector />
          </Box>
        </PageContent>
      </PageWrapper>
    </AdminGuard>
  );
}
