import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { StripedDataGrid } from "src/components";
import { IBaseData, IDriver } from "src/models";
import { formatCurrency } from "src/utils";

interface Props {
  data?: IBaseData["categoriesData"];
  drivers: IDriver[];
}

const CategoriesTable = ({ data, drivers }: Props) => {
  const [rows, setRows] = useState<IBaseData["categoriesData"]["rows"]>([]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "category",
        headerName: "Rotulos de fila",
        flex: 1,
      },
      ...drivers
        .filter((x) => -1 !== x.columnIndexReference)
        .map(
          (driver, index) =>
            ({
              field: driver.key,
              headerName: `${index === 0 ? "Count of" : "Sum of"} ${driver.label}`,
              valueFormatter: (value) =>
                index === 0 ? value : formatCurrency(value as number),
              type: "number",
              minWidth: 175,
            }) as GridColDef
        ),
    ],
    [drivers]
  );

  const totalColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "1",
        headerName: "Totales",
        flex: 1,
        headerClassName: "bold",
      },
      ...drivers
        .filter((x) => -1 !== x.columnIndexReference)
        .map(
          (driver) =>
            ({
              field: driver.key,
              headerName: formatCurrency(
                (data?.rows ?? []).reduce(
                  (acc, row) => acc + (row[driver.key] as number),
                  0
                )
              ),
              type: "number",
              minWidth: 175,
            }) as GridColDef
        ),
    ],
    [data?.rows, drivers]
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