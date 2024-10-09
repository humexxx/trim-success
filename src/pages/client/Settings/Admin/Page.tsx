import { Box } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { AdminColumns } from "./components";
import { AdminRoute } from "src/components";
import { COLUMNS } from "@shared/consts";

const Page = () => {
  useDocumentMetadata("Configuracion Admin - Trim Success");

  return (
    <AdminRoute>
      <Box sx={{ padding: 4 }}>
        <AdminColumns columns={COLUMNS} />
      </Box>
    </AdminRoute>
  );
};

export default Page;
