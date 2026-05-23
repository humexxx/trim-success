import { COLUMNS } from "@shared/consts";
import { AdminGuard } from "src/components";
import { useDocumentMetadata } from "src/hooks";

import { AdminColumns } from "./components";

const Page = () => {
  useDocumentMetadata("Configuración admin - Trim Success");

  return (
    <AdminGuard>
      <AdminColumns columns={COLUMNS} />
    </AdminGuard>
  );
};

export default Page;
