import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { TotalGrid } from "src/components";
import { IScorecardData } from "@shared/models";
import { formatCurrency } from "@shared/utils";

interface Props {
  data?: IScorecardData;
  categories: string[];
  loading: boolean;
}

const GrandTotalGrid = ({ data, categories, loading }: Props) => {
  const totalColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "1",
        headerName: "Costo de Mantener el Inventario (ICC)",
        headerClassName: "bold",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "2",
        headerName: "",
        width: 150,
      },
      ...categories.sort().map(
        (category) =>
          ({
            field: category,
            headerName: formatCurrency(
              Number(data?.inventoryCosts.totals[category]) +
                Number(data?.storingCosts.totals[category])
            ),
            width: 150,
            headerClassName: "bold",
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: formatCurrency(
          Number(data?.inventoryCosts.totals.total) +
            Number(data?.storingCosts.totals.total)
        ),
        width: 150,
        headerClassName: "bold",
      },
      {
        field: "totalPercentage",
        headerName: "",
        width: 100,
      },
      {
        field: "4",
        headerName: "",
        width: 150,
        editable: true,
        type: "singleSelect",
      },
    ],
    [categories, data]
  );
  return <TotalGrid loading={loading} columns={totalColumns} />;
};

export default GrandTotalGrid;
