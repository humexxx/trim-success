import { Box, Toolbar, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
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
    field: "sumOfGrossMargin",
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
  const [sumRow, setSumRow] = useState<
    IBaseData["categoriesData"]["rows"][number] | null
  >(null);

  useEffect(() => {
    if (data?.rows) {
      setSumRow({
        category: "Total",
        ...DRIVERS.filter((x) => !x.catHiddenByDefault).reduce(
          (acc, driver) => {
            acc[driver.name] = data.rows.reduce(
              (acc, row) => acc + (row[driver.name] as number),
              0
            );
            return acc;
          },
          {} as Omit<
            IBaseData["categoriesData"]["rows"][number],
            "category" | "grossMargin"
          >
        ),
        grossMargin: data.rows.reduce(
          (acc, row) => acc + Number(row.grossMargin),
          0
        ),
      } as IBaseData["categoriesData"]["rows"][number]);
      setRows(data.rows);
    }
  }, [data]);

  return (
    <>
      <Box>
        <DataGrid
          getRowId={(row) => row.category}
          aria-label="Categories Table"
          columns={columns}
          rows={rows}
          hideFooter
          disableAutosize
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          disableRowSelectionOnClick
          density="compact"
          initialState={{
            sorting: {
              sortModel: [{ field: "category", sort: "asc" }],
            },
          }}
        />
      </Box>
      <Toolbar
        sx={{
          bgcolor: "action.disabledBackground",
          px: "10px !important",
          overflowX: "auto",
        }}
      >
        <Typography variant="body2" flex={1}>
          * Total:
        </Typography>
        {sumRow &&
          Object.values(sumRow)
            .splice(2, Object.values(sumRow).length)
            .map((value, index) => (
              <Typography
                key={index}
                variant="body2"
                minWidth={175}
                textAlign={"right"}
              >
                {typeof value === "number" &&
                (index === 2 || index === 5 || index == 6)
                  ? formatCurrency(value)
                  : value}
              </Typography>
            ))}
      </Toolbar>
    </>
  );
};

export default CategoriesTable;
