import { PageContent, PageHeader } from "src/components/layout";
import { useCube } from "src/context/hooks";

import { MainGrid, Reports } from "./components";

const Page = () => {
  const cube = useCube();

  if (cube.isCubeLoading || !cube.data) return null;

  return (
    <>
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      />
      <PageContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <MainGrid />
          </div>
          <div className="lg:col-span-3">
            <Reports />
          </div>
        </div>
      </PageContent>
    </>
  );
};

export default Page;
