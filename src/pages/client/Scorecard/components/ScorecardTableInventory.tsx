import { useEffect, useMemo, useState } from "react";

import { GridCellParams, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { IDriver, IParameter, IScorecardData } from "@shared/models";
import { formatAmount, formatPercentage } from "@shared/utils";
import { StripedDataGrid } from "src/components";

interface Props {
  data?: IScorecardData["inventoryCosts"];
  categories: string[];
  investmentTypes: IParameter[];
  updateRow: (
    row: IScorecardData["inventoryCosts"]["rows"][number]
  ) => Promise<void>;
  drivers: IDriver[];
  loading: boolean;
}

function isCellEditable(params: GridCellParams) {
  if (params.field === "invest") {
    return "invest" in params.row;
  }
  return true;
}

const ScorecardTableInventory = ({
  data,
  categories,
  investmentTypes,
  updateRow,
  drivers,
  loading,
}: Props) => {
  const [rows, setRows] = useState<
    GridRowModel<IScorecardData["inventoryCosts"]["rows"][number]>[]
  >(data?.rows ?? []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "cost",
        headerName: "Costos del Inventario",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "driver",
        headerName: "Driver",
        width: 150,
        editable: true,
        type: "singleSelect",
        valueOptions: drivers,
        getOptionValue: (value: IDriver) => value.key,
        getOptionLabel: (value: IDriver) => value.label,
        valueFormatter: (params) => {
          return drivers.find((driver) => driver.key === params)?.label;
        },
      },
      ...categories.sort().map(
        (category) =>
          ({
            field: category,
            headerName: category,
            minWidth: 150,
            valueFormatter: formatAmount,
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: "Costos Totales",
        width: 150,
        valueFormatter: formatAmount,
      },
      {
        field: "totalPercentage",
        headerName: "% Cost",
        width: 100,
        valueFormatter: formatPercentage,
      },
      {
        field: "invest",
        headerName: "% Investment Type",
        width: 150,
        editable: true,
        type: "singleSelect",
        valueOptions: investmentTypes,
        getOptionValue: (value: IParameter) => value.name,
        getOptionLabel: (value: IParameter) =>
          `${value.name} (${formatPercentage(value.value / 100)})`,
        valueFormatter: (params) => {
          return (
            formatPercentage(
              Number(
                investmentTypes.find((type) => type.name === params)?.value
              ) / 100
            ) || "n/a"
          );
        },
      },
    ],
    [categories, drivers, investmentTypes]
  );

  const totalColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "1",
        headerName: "Costo total del Inventario",
        flex: 1,
        minWidth: 150,
        headerClassName: "bold",
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
            headerName: formatAmount(Number(data?.totals[category])),
            width: 150,
          }) as GridColDef
      ),
      {
        field: "total",
        headerName: formatAmount(Number(data?.totals.total)),
        width: 150,
      },
      {
        field: "totalPercentage",
        headerName: formatPercentage(Number(data?.totals.totalPercentage)),
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
    [categories, data?.totals]
  );

  const processRowUpdate = (
    row: GridRowModel<IScorecardData["inventoryCosts"]["rows"][number]>
  ) => {
    updateRow(row);
    return row;
  };

  useEffect(() => {
    setRows(data?.rows ?? []);
  }, [data]);

  return (
    <>
      <StripedDataGrid
        getRowId={(row) => row.cost}
        aria-label="Costos del Inventario"
        columns={columns}
        rows={rows}
        disableColumnMenu
        hideFooter
        editMode="row"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        totalColumns={totalColumns}
        isCellEditable={isCellEditable}
        loading={loading}
      />
    </>
  );
};

export default ScorecardTableInventory;
