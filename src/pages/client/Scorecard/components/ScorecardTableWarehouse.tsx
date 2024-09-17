import { GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { StripedDataGrid } from "src/components";
import { DRIVERS } from "src/consts";
import { IScorecardData } from "src/models/user";
import { formatCurrency, formatPercentage } from "src/utils";

interface Props {
  data?: IScorecardData["storingCosts"];
  categories: string[];
  investmentTypes: string[];
  updateRow: (row: IScorecardData["storingCosts"]["rows"][number]) => void;
}

const ScorecardTableWarehouse = ({
  data,
  categories,
  investmentTypes,
  updateRow,
}: Props) => {
  const [rows, setRows] = useState<
    GridRowModel<IScorecardData["storingCosts"]["rows"][number]>[]
  >(data?.rows ?? []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "cost", headerName: "Warehousing  Costs", width: 150 },
      {
        field: "driver",
        headerName: "Driver",
        width: 150,
        editable: true,
        type: "singleSelect",
        valueOptions: DRIVERS.map((driver) => driver.name),
      },
      ...categories.sort().map(
        (category) =>
          ({
            field: category,
            headerName: category,
            width: 150,
            valueFormatter: formatCurrency,
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costos Totales",
        width: 150,
        valueFormatter: formatCurrency,
      },
      {
        field: "totalPercentage",
        headerName: "% Cost",
        width: 150,
        valueFormatter: formatPercentage,
      },
      {
        field: "invest",
        headerName: "Investment Type",
        width: 150,
        editable: true,
        type: "singleSelect",
        valueOptions: investmentTypes,
      },
    ],
    [categories, investmentTypes]
  );

  const processRowUpdate = (row: GridRowModel) => {
    updateRow(row as IScorecardData["storingCosts"]["rows"][number]);
    return row;
  };

  useEffect(() => {
    setRows(data?.rows ?? []);
  }, [data]);

  return (
    <StripedDataGrid
      getRowId={(row) => row.cost}
      aria-label="Warehousing Costs"
      columns={columns}
      rows={rows}
      disableColumnMenu
      hideFooter
      density="compact"
      editMode="row"
      processRowUpdate={processRowUpdate}
    />
  );
};

export default ScorecardTableWarehouse;