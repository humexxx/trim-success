import { PageWrapper } from "src/components/layout";
import { useAuth } from "src/context/hooks";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdminSettings } from "./Admin";
import { UserSettings } from "./components";
import { CubeSettings } from "./Cube";

export interface DataSet {
  id?: number;
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number;
}

const Page = () => {
  const { isAdmin } = useAuth();

  return (
    <PageWrapper title="Configuración">
      <Tabs defaultValue="user" className="mb-4">
        <TabsList>
          <TabsTrigger value="user">Usuario</TabsTrigger>
          <TabsTrigger value="cube">Cube</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>
        <TabsContent value="user" className="mt-4 p-2">
          <UserSettings />
        </TabsContent>
        <TabsContent value="cube" className="mt-4 p-2">
          <CubeSettings />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="admin" className="mt-4 p-2">
            <AdminSettings />
          </TabsContent>
        )}
      </Tabs>
    </PageWrapper>
  );
};

export default Page;
