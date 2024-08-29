import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useCube } from "src/context/cube";
import { getCategories, getDriversPercentagesAsync } from "src/utils";

const CATTable = () => {
  const { fileResolution } = useCube();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const categories = useMemo(
    () => getCategories(fileResolution?.rows),
    [fileResolution]
  );

  const columns: GridColDef[] = useMemo(() => {
    const columns: GridColDef[] = [
      {
        field: "id",
        display: "text",
      },
      {
        field: "driver",
        headerName: "Driver",
        valueFormatter: (value) => `% ${value}`,
        width: 175,
      },
      ...categories.map((category) => ({
        field: category,
        headerName: category,
        flex: 1,
        valueFormatter: (value: number) => `${value.toFixed(2)}%`,
      })),
    ];
    return columns;
  }, [categories]);

  useEffect(() => {
    if (fileResolution) {
      setIsLoading(true);
      getDriversPercentagesAsync(fileResolution.rows!).then((data) => {
        setRows(data);
        setIsLoading(false);
      });
    }
  }, [fileResolution]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      loading={isLoading}
      hideFooter
      disableAutosize
      disableColumnMenu
      disableColumnResize
      disableColumnSelector
      disableRowSelectionOnClick
      density="compact"
      initialState={{
        columns: {
          columnVisibilityModel: {
            id: false,
          },
        },
      }}
    />
  );
};

export default CATTable;
