import { Box } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { Columns, Drivers } from "./components";
import { COLUMNS } from "@shared/consts";
import { useCube } from "src/context/cube";

const Page = () => {
  useDocumentMetadata("Configuracion Cube - Trim Success");

  const cube = useCube();

  return (
    <Box sx={{ padding: 4 }}>
      <Drivers drivers={cube.data?.paramsData.drivers} />
      <Columns columns={COLUMNS} />
    </Box>
  );
};

export default Page;
