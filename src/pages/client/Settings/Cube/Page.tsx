import { Box } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { Columns, Drivers } from "./components";
import { COLUMNS, DRIVERS } from "src/consts";

const Page = () => {
  useDocumentMetadata("Configuracion Cube - Trim Success");

  return (
    <Box sx={{ padding: 4 }}>
      <Drivers drivers={DRIVERS} />
      <Columns columns={COLUMNS} />
    </Box>
  );
};

export default Page;
