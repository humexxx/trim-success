import { Box } from "@mui/material";
import { COLUMNS } from "@shared/consts";
import { useCube } from "src/context/cube";
import { useDocumentMetadata } from "src/hooks";

import { Columns, Drivers } from "./components";

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
