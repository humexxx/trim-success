import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getError,
  getJsonDataFromWorkbookAsync,
  getWorkbookFromFileAsync,
} from "src/utils";
import * as XLSX from "xlsx";
import { FileResolution } from "./ImportDataPage";

interface Props {
  fileResolution: FileResolution;
  setFileResolution: (fileResolution: FileResolution) => void;
  stepperLoading: boolean;
  setStepperLoading: (loading: boolean) => void;
}

const SelectTabStep = ({
  setFileResolution,
  fileResolution,
  stepperLoading,
  setStepperLoading,
}: Props) => {
  const [sheet, setSheet] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);

  useEffect(() => {
    async function formatData() {
      if (!fileResolution.file) return;
      setLoading(true);
      try {
        const workbook = await getWorkbookFromFileAsync(fileResolution.file);
        setSheet(workbook.SheetNames[0]);
        setWorkbook(workbook);
      } catch (e) {
        setError(getError(e));
      } finally {
        setLoading(false);
      }
    }

    formatData();
  }, [fileResolution.file]);

  useEffect(() => {
    if (!sheet || !workbook) return;

    async function formatData() {
      setStepperLoading(true);
      setFileResolution({ ...fileResolution, jsonData: undefined });

      try {
        const jsonData = await getJsonDataFromWorkbookAsync(workbook!, sheet);

        setFileResolution({
          ...fileResolution,
          jsonData,
        });
      } catch (e) {
        setError(getError(e));
      } finally {
        setStepperLoading(false);
      }
    }
    formatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  return (
    <Box maxWidth={600} my={4}>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Typography variant="body1" color="text.primary" mb={2}>
          <CircularProgress size={15} sx={{ mr: 2 }} /> Formateando archivo...
        </Typography>
      )}
      {Boolean(workbook?.SheetNames.length) && (
        <TextField
          variant="filled"
          select
          label="Hoja"
          value={sheet}
          onChange={(ev) => setSheet(ev.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={stepperLoading}
        >
          {workbook!.SheetNames.map((sheetName) => (
            <MenuItem key={sheetName} value={sheetName}>
              {sheetName}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export default SelectTabStep;
