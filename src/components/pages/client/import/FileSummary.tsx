import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

interface Row {
  id: number;
  [key: string]: any;
}

interface FileSummaryProps {
  jsonData: any[][];
}

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

const FileSummary = ({ jsonData }: FileSummaryProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const header = jsonData[0] as string[];
    const cols = header.map((col) => ({
      field: col,
      headerName: col,
      width: 150,
    }));

    setColumns(cols);

    const rowsData = jsonData.slice(1).map((row, index) =>
      row.reduce((acc, cell, i) => ({ ...acc, [header[i]]: cell }), {
        id: index + 1,
      })
    );

    setRowsCount(rowsData.length);
    setRows((rowsData as Row[]).slice(0, 8));
  }, [jsonData]);

  const backgroundRgb = useMemo(
    () => hexToRgb(theme.palette.background.default),
    [theme.palette.background.default]
  );

  return (
    <>
      <Typography color="text.primary" mt={2}>
        <strong>Cantidad de columnas:</strong> {columns?.length}
      </Typography>
      <Typography color="text.primary" mb={2}>
        <strong>Cantidad de filas:</strong> {rowsCount}
      </Typography>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          "& .MuiDataGrid-scrollbar": {
            top: 0,
          },
          "& .MuiDataGrid-virtualScroller": {
            top: "18px",
          },
        }}
      >
        <DataGrid
          sx={{ fontSize: "0.75rem" }}
          rows={rows}
          columns={columns}
          hideFooter
          disableColumnSorting
          disableAutosize
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          disableRowSelectionOnClick
          density="compact"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 10,
            height: "70px",
            background: `linear-gradient(to bottom, rgba(${backgroundRgb}, 0) 0%, rgba(${backgroundRgb}, 1) 100%)`,
          }}
        ></Box>
      </Box>
    </>
  );
};

export default FileSummary;
