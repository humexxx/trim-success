import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Row, useCube } from "src/context/cube";
import { getColsAndRows } from "src/utils";

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

const FileSummary = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const theme = useTheme();
  const cube = useCube();

  useEffect(() => {
    const { columns, rows } = getColsAndRows(cube.fileResolution?.jsonData);
    cube.setFileResolution({ ...cube.fileResolution, columns, rows });
    setRows((rows as Row[]).slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundRgb = useMemo(
    () => hexToRgb(theme.palette.background.default),
    [theme.palette.background.default]
  );

  return (
    <>
      <Typography color="text.primary" mt={2}>
        <strong>Cantidad de columnas:</strong>{" "}
        {cube.fileResolution?.columns?.length}
      </Typography>
      <Typography color="text.primary" mb={2}>
        <strong>Cantidad de filas:</strong> {cube.fileResolution?.rows?.length}
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
          columns={cube.fileResolution?.columns ?? []}
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
