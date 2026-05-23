import { COLUMNS } from "@shared/consts";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { Columns, Drivers } from "./components";

const Page = () => {
  useDocumentMetadata("Configuracion Cube - Trim Success");

  const cube = useCube();

  return (
    <div className="space-y-6 p-6">
      <Drivers drivers={cube.data?.cubeParameters.drivers} />
      <Columns columns={COLUMNS} />
    </div>
  );
};

export default Page;
