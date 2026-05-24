import { COLUMNS } from "@shared/consts";
import { AdminGuard } from "src/components";
import { useDocumentMetadata } from "src/hooks";

import { AdminColumns } from "./components";

const Page = () => {
  useDocumentMetadata(
    "Admin",
    "Herramientas de administración: gestión de columnas, drivers y catálogo."
  );

  return (
    <AdminGuard>
      <AdminColumns columns={COLUMNS} />
    </AdminGuard>
  );
};

export default Page;
