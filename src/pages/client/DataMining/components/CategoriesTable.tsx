import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { StripedDataGrid } from "src/components";
import { DRIVERS } from "src/consts";
import { IBaseData } from "src/models";
import { formatCurrency } from "src/utils";

const columns: GridColDef[] = [
  {
    field: "category",
    headerName: "Rotulos de fila",
    flex: 1,
  },
  ...DRIVERS.filter((x) => !x.catHiddenByDefault).map(
    (driver) =>
      ({
        field: driver.name,
        headerName: driver.catDescription,
        type: "number",
        minWidth: 175,
      }) as GridColDef
  ),
  {
    field: "grossMargin",
    headerName: "Sum of Gross Margin",
    valueFormatter: formatCurrency,
    type: "number",
    minWidth: 175,
  },
];

interface Props {
  data?: IBaseData["categoriesData"];
}

const CategoriesTable = ({ data }: Props) => {
  const [rows, setRows] = useState<IBaseData["categoriesData"]["rows"]>([]);

  const totalColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "1",
        headerName: "Totales",
        flex: 1,
        headerClassName: "bold",
      },
      ...DRIVERS.filter((x) => !x.catHiddenByDefault).map(
        (driver) =>
          ({
            field: driver.name,
            headerName: formatCurrency(
              (data?.rows ?? []).reduce(
                (acc, row) => acc + (row[driver.name] as number),
                0
              )
            ),
            type: "number",
            minWidth: 175,
          }) as GridColDef
      ),
      {
        field: "grossMargin",
        type: "number",
        minWidth: 175,
        headerName: formatCurrency(
          (data?.rows ?? []).reduce(
            (acc, row) => acc + Number(row.grossMargin),
            0
          )
        ),
      },
    ],
    [data?.rows]
  );

  useEffect(() => {
    if (data?.rows) {
      setRows(data.rows);
    }
  }, [data]);

  return (
    <>
      <Box>
        <StripedDataGrid
          getRowId={(row) => row.category}
          aria-label="Categories Table"
          columns={columns}
          rows={rows}
          totalColumns={totalColumns}
          initialState={{
            sorting: {
              sortModel: [{ field: "category", sort: "asc" }],
            },
          }}
        />
      </Box>
    </>
  );
};

export default CategoriesTable;
