import { PageHeader, PageWrapper } from "src/components/layout";
import { useAuth } from "src/context/hooks";


import { AdminSettings } from "./Admin";
import { UserSettings } from "./components";
import { CubeSettings } from "./Cube";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface DataSet {
  id?: number;
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number;
}

const Page = () => {
  const { isAdmin } = useAuth();

  return (
    <PageWrapper
      title="Configuración"
      description="Ajustes del cubo, preferencias de cuenta y opciones avanzadas."
    >
      <PageHeader
        title="Configuración"
        description="Datos de la cuenta, columnas del cubo y, si eres admin, configuración global."
      />
      <Tabs defaultValue="user" className="mt-8">
        <TabsList>
          <TabsTrigger value="user">Usuario</TabsTrigger>
          <TabsTrigger value="cube">Cube</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>
        <TabsContent value="user" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cube" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <CubeSettings />
            </CardContent>
          </Card>
        </TabsContent>
        {isAdmin && (
          <TabsContent value="admin" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <AdminSettings />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </PageWrapper>
  );
};

export default Page;
