import { PageHeader } from "src/components";
import { useCube } from "src/context/hooks";
import {
  ImportedDataPage,
  ImportDataPage,
} from "src/pages/client/ImportPage/components";

export default function Page() {
  const cube = useCube();

  return (
    <PageHeader title="Importar">
      {cube.hasInitialData ? <ImportedDataPage /> : <ImportDataPage />}
    </PageHeader>
  );
}
