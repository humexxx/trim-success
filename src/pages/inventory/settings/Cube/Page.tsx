import { COLUMNS } from "@shared/consts";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { Columns, Drivers } from "./components";

/**
 * Rendered inside the parent Settings Tabs Card (which already owns
 * the outer padding + Card chrome), so this only needs to lay out
 * the two sub-sections vertically.
 */
const Page = () => {
  useDocumentMetadata("Configuración del cubo - Trim Success");
  const cube = useCube();

  return (
    <div className="space-y-8">
      <Drivers drivers={cube.data?.cubeParameters.drivers} />
      <Columns columns={COLUMNS} />
    </div>
  );
};

export default Page;
