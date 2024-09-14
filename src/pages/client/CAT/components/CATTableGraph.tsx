import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useCube } from "src/context/cube";
import { getCATDataAsync } from "src/utils";

const CATTable = () => {
  const {
    fileResolution,
    dataParams: { data },
  } = useCube();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const columns: GridColDef[] = useMemo(() => {
    const columns: GridColDef[] = [
      {
        field: "driver",
        headerName: "Driver",
        valueFormatter: (value) => `% ${value}`,
        width: 175,
      },
      ...data!.categories.map((category) => ({
        field: category,
        headerName: category,
        flex: 1,
        valueFormatter: (value: number) => `${Math.round(value)}%`,
        type: "number" as any,
      })),
    ];
    return columns;
  }, [data]);

  useEffect(() => {
    if (fileResolution) {
      setIsLoading(true);
      getCATDataAsync(fileResolution.rows!).then((data) => {
        setRows(data);
        setIsLoading(false);
      });
    }
  }, [fileResolution]);

  return (
    <DataGrid
      aria-label="CAT Table"
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
    />
  );
};

export default CATTable;
