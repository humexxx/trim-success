import {
  ImportedDataPage,
  ImportDataPage,
} from "src/pages/client/ImportPage/components";
import { useCube } from "src/context/cube";
import { PageHeader } from "src/components";

export default function Page() {
  const cube = useCube();

  return (
    <PageHeader title="Importar">
      {cube.hasInitialData ? <ImportedDataPage /> : <ImportDataPage />}
    </PageHeader>
  );
}
