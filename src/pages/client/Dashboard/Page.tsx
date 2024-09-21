import { PageHeader } from "src/components";
import { useDocumentMetadata } from "src/hooks";

const Page = () => {
  useDocumentMetadata("Panel - Trim Success");

  return (
    <>
      <PageHeader title="Panel" description="Algunos datos se mostrarán aquí" />
    </>
  );
};

export default Page;
