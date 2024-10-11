import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { getError, getWorkbookFromFileAsync } from "src/utils";

import { FileResolution } from "./ImportDataPage";

interface Props {
  fileResolution: FileResolution;
  setFileResolution: (fileResolution: FileResolution) => void;
}

const SelectSheetStep = ({ setFileResolution, fileResolution }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function formatData() {
      if (!fileResolution.file) return;
      setLoading(true);
      try {
        const workbook = await getWorkbookFromFileAsync(fileResolution.file);
        setFileResolution({
          ...fileResolution,
          sheetName: workbook.SheetNames[0],
          workbook,
        });
      } catch (e) {
        setError(getError(e));
      } finally {
        setLoading(false);
      }
    }

    formatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileResolution.file]);

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
      {Boolean(fileResolution.workbook?.SheetNames.length) && (
        <TextField
          variant="filled"
          select
          label="Sheet"
          value={fileResolution.sheetName}
          onChange={(ev) =>
            setFileResolution({ ...fileResolution, sheetName: ev.target.value })
          }
          fullWidth
          sx={{ mt: 2 }}
        >
          {fileResolution.workbook!.SheetNames.map((sheetName) => (
            <MenuItem key={sheetName} value={sheetName}>
              {sheetName}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export default SelectSheetStep;
