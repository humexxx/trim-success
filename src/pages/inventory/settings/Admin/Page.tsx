import { Box } from "@mui/material";
import { COLUMNS } from "@shared/consts";
import { AdminGuard } from "src/components";
import { useDocumentMetadata } from "src/hooks";

import { AdminColumns } from "./components";

const Page = () => {
  useDocumentMetadata("Configuracion Admin - Trim Success");

  return (
    <AdminGuard>
      <Box sx={{ padding: 4 }}>
        <AdminColumns columns={COLUMNS} />
      </Box>
    </AdminGuard>
  );
};

export default Page;
