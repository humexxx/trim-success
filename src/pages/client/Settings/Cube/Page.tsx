import { Box } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { Columns, Drivers } from "./components";
import { useSettingsCube } from "../hooks";

const Page = () => {
  useDocumentMetadata("Configuracion Cube - Trim Success");
  const { globalSettings, loading, error } = useSettingsCube();

  return (
    <Box sx={{ padding: 4 }}>
      <Drivers
        drivers={globalSettings?.drivers}
        loading={loading}
        error={error}
      />
      <Columns
        columns={globalSettings?.columns}
        loading={loading}
        error={error}
      />
    </Box>
  );
};

export default Page;
