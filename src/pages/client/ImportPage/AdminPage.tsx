import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdminClientSelector } from "src/pages/client/ImportPage/components";
import { useDocumentMetadata } from "src/hooks";
import { AdminRoute } from "src/components";

export default function Page() {
  useDocumentMetadata("Importar (Admin) - Trim Success");

  return (
    <AdminRoute>
      <Box>
        <Typography variant="h6">Cargar Archivo de Usuario</Typography>
        <Typography variant="caption">
          Como eres administrador, puedes cargar un archivo de usuario
        </Typography>
        <AdminClientSelector />
      </Box>
    </AdminRoute>
  );
}
