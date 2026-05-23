import { COLUMNS } from "@shared/consts";
import { AdminGuard } from "src/components";
import { useDocumentMetadata } from "src/hooks";

import { AdminColumns } from "./components";

const Page = () => {
  useDocumentMetadata("Configuracion Admin - Trim Success");

  return (
    <AdminGuard>
      <div className="p-6">
        <AdminColumns columns={COLUMNS} />
      </div>
    </AdminGuard>
  );
};

export default Page;
