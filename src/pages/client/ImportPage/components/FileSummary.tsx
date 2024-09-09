import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
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

interface Props {
  error: string;
  setError: (error: string) => void;
}

const FileSummary = ({ error, setError }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const theme = useTheme();
  const { fileResolution, setFileResolution, globalSettings, loading } =
    useCube();
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const { columns, rows } = getColsAndRows(fileResolution?.jsonData);
    setFileResolution({ ...fileResolution, columns, rows });
    setRows((rows as Row[]).slice(0, 8));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundRgb = useMemo(
    () => hexToRgb(theme.palette.background.default),
    [theme.palette.background.default]
  );

  useEffect(() => {
    if (rows.length && fileResolution?.columns?.length && globalSettings) {
      const hasSameColumns =
        globalSettings.columns.flatMap((x) => x.index).length ===
        fileResolution.columns.length;
      if (!hasSameColumns) {
        setError(
          "Las columnas del archivo no coinciden con las columnas de la configuración global"
        );
      }
    }
  }, [loading, globalSettings, fileResolution, rows, setError]);

  if (loading || _loading) {
    return (
      <Box m={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {Boolean(error) && (
        <Alert severity="error" sx={{ my: 2 }}>
          <Typography color="text.primary">{error}</Typography>
        </Alert>
      )}
      <Typography variant="h6" color="text.primary" mt={2}>
        Columnas: {fileResolution?.columns?.length}
      </Typography>
      <Typography variant="h6" color="text.primary" mb={2}>
        Filas: {fileResolution?.rows?.length}
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
          columns={fileResolution?.columns ?? []}
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
