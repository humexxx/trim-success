import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";
import {
  ImportedDataPage,
  ImportDataPage,
} from "src/pages/client/ImportPage/components";

export default function Page() {
  const cube = useCube();

  return (
    <>
      <PageHeader title="Importar" />
      <PageContent>
        {cube.hasInitialData ? <ImportedDataPage /> : <ImportDataPage />}
      </PageContent>
    </>
  );
}
