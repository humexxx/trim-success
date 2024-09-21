import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getColsAndRowsAsync, getJsonDataFromFileAsync } from "src/utils";
import { FileResolution } from "../Page";
import { StripedDataGrid } from "src/components";
import { useCube } from "src/context/cube";

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
  setLoading: (loading: boolean) => void;
  loading: boolean;
  fileResolution: FileResolution;
  setFileResolution: (fileResolution: FileResolution) => void;
}

const FileSummary = ({
  error,
  setError,
  loading,
  setLoading,
  fileResolution,
  setFileResolution,
}: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const cube = useCube();
  const theme = useTheme();
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  useEffect(() => {
    async function formatData() {
      setLoading(true);
      try {
        setProgressMessage("Formateando archivo...");
        const jsonData = await getJsonDataFromFileAsync(fileResolution.file!);
        setProgressMessage("Obteniendo columnas y filas...");
        const { columns, rows } = await getColsAndRowsAsync(jsonData);
        cube.setFileData({ columns, rows });
        setFileResolution({ ...fileResolution, columns, rows, jsonData });
        setRows((rows as any[]).slice(0, 8));
        setLoading(false);
      } catch (e) {
        setError("Error al formatear el archivo");
      } finally {
        setLoading(false);
        setProgressMessage(null);
      }
    }
    formatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundRgb = useMemo(
    () => hexToRgb(theme.palette.background.default),
    [theme.palette.background.default]
  );

  if (loading) {
    return (
      <Box m={8}>
        <Typography variant="body1" color="text.primary" mb={2}>
          <CircularProgress size={15} sx={{ mr: 2 }} /> {progressMessage}
        </Typography>
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
      <Typography variant="body1" color="text.primary" mt={2}>
        Columnas: {fileResolution?.columns?.length}
      </Typography>
      <Typography variant="body1" color="text.primary" mb={2}>
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
        <StripedDataGrid
          sx={{ fontSize: "0.75rem" }}
          rows={rows}
          columns={
            fileResolution?.columns?.map((x) => {
              return { field: x, headerName: x };
            }) ?? []
          }
          autosizeOnMount
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
