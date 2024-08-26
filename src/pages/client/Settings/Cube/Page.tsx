import { Box } from "@mui/material";
import { useSettingsCube } from "../hooks";
import { useDocumentMetadata } from "src/hooks";
import { Columns, Drivers } from "./components";

const Page = () => {
  useDocumentMetadata("Configuracion Cube - Trim Success");
  const { settings, loading, error } = useSettingsCube();

  return (
    <Box sx={{ padding: 4 }}>
      <Drivers drivers={settings?.drivers} loading={loading} error={error} />
      <Columns columns={settings?.columns} loading={loading} error={error} />
    </Box>
  );
};

export default Page;
