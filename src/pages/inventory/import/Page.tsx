import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { ImportDataPage, ImportedDataPage } from "./components";

export default function Page() {
  const cube = useCube();

  return (
    <PageWrapper title="Importar" maxWidth="lg">
      <PageHeader
        title="Importar datos"
        description={
          cube.hasInitialData
            ? "Datos cargados al cubo. Puedes ver el detalle abajo o reimportar desde el wizard."
            : "Sigue los 3 pasos para cargar tu archivo Excel y desbloquear todos los reportes."
        }
      />
      <div className="mt-8">
        {cube.hasInitialData ? <ImportedDataPage /> : <ImportDataPage />}
      </div>
    </PageWrapper>
  );
}
