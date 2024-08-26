import { Box } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { AdminColumns } from "./components";
import { AdminRoute } from "src/components";
import { useGlobalSettingsCube } from "../hooks";

const Page = () => {
  useDocumentMetadata("Configuracion Admin - Trim Success");
  const { globalSettings, updateGlobalColumns, loading, error } =
    useGlobalSettingsCube();

  return (
    <AdminRoute>
      <Box sx={{ padding: 4 }}>
        <AdminColumns
          columns={globalSettings?.columns}
          loading={loading}
          updateColumns={updateGlobalColumns}
        />
      </Box>
    </AdminRoute>
  );
};

export default Page;
