import { Box } from "@mui/material";
import { AdminRoute, PageHeader } from "src/components";
import { useDocumentMetadata } from "src/hooks";

import { AdminClientSelector } from "./components";


export default function Page() {
  useDocumentMetadata("Seleccionar Usuario - Trim Success");

  return (
    <AdminRoute>
      <PageHeader
        title="Cargar Archivo de Usuario"
        description="Como eres administrador, puedes cargar un archivo de usuario"
      />
      <Box maxWidth={450}>
        <AdminClientSelector />
      </Box>
    </AdminRoute>
  );
}
