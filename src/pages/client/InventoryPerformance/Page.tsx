import { PageHeader } from "src/components";
import { useInventoryPerformance } from "./hooks";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { IInventoryPerformanceData } from "@shared/models";
import { getError } from "src/utils";
import { Table } from "./components";
import { useCube } from "src/context/cube";

const Page = () => {
  const [data, setData] = useState<IInventoryPerformanceData>();
  const [error, setError] = useState<string | null>(null);

  const cube = useCube();
  const inventoryPerformance = useInventoryPerformance();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await inventoryPerformance.get();
        setData(data);
      } catch (error) {
        setError(getError(error));
      }
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <PageHeader
      title="Rendimiento de Inventario"
      description="Conjunto de métricas que mide la eficiencia y rentabilidad del inventario, optimizando niveles de stock, costos y retornos."
    >
      {inventoryPerformance.loading ? (
        <Alert severity="info">Cargando...</Alert>
      ) : (
        <>
          {Boolean(data) && (
            <Table
              data={data!}
              categories={cube.data?.paramsData.categories ?? []}
            />
          )}
        </>
      )}
    </PageHeader>
  );
};

export default Page;
