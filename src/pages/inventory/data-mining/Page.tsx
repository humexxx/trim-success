import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import { CategoriesGraph, CategoriesTable, DriversTable } from "./components";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  const { data, isCubeLoading } = useCube();

  const baseData = data?.baseData;
  const cubeParameters = data?.cubeParameters;

  if (!cubeParameters || isCubeLoading) {
    return (
      <Alert>
        <AlertDescription>Loading...</AlertDescription>
      </Alert>
    );
  }

  return (
    <PageWrapper title="Data Mining">
      <PageHeader
        title="Data Mining"
        description="Data Mining Categories & Drivers"
      />

      <PageContent>
        <div className="flex flex-col gap-8">
          <Card>
            <CardContent className="p-6">
              <CategoriesTable
                data={baseData?.categoriesData}
                drivers={cubeParameters.drivers}
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-8">
            <CategoriesGraph
              data={baseData!.categoriesData}
              drivers={cubeParameters.drivers}
            />
          </div>
          <Card>
            <CardContent className="p-6">
              <DriversTable
                data={baseData?.driversData}
                categories={cubeParameters?.categories ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
