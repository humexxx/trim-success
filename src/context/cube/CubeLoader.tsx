import { Check } from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { getBlob, listAll, ref } from "firebase/storage";
import { getColsAndRowsAsync, getJsonDataFromFileAsync } from "src/utils";
import { storage } from "src/firebase";
import { STORAGE_PATH } from "src/consts";
import { ExtraStepToLoad, FileResolution } from "./CubeContext.types";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

interface Props {
  loadCube: boolean;
  setLoadCube: (value: boolean) => void;
  userId: string;
  setFileResolution: (value: FileResolution | undefined) => void;
  extraStepsToLoad: ExtraStepToLoad[];
  setExtraStepsToLoad: React.Dispatch<React.SetStateAction<ExtraStepToLoad[]>>;
  fileResolution: FileResolution | undefined;
}

interface LoadingProgress {
  file: "not loaded" | "loaded" | "loading";
  jsonData: "not loaded" | "loaded" | "loading";
  rowsAndColumns: "not loaded" | "loaded" | "loading";
}

const CubeLoader = ({
  setLoadCube,
  loadCube,
  userId,
  setFileResolution,
  setExtraStepsToLoad,
  extraStepsToLoad,
  fileResolution,
}: Props) => {
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    file: fileResolution?.file ? "loaded" : "loading",
    jsonData: fileResolution?.jsonData ? "loaded" : "not loaded",
    rowsAndColumns: fileResolution?.rows ? "loaded" : "not loaded",
  });

  function getStatusIndicator(status: "not loaded" | "loaded" | "loading") {
    if (status === "not loaded") {
      return (
        <FiberManualRecordIcon
          sx={{ color: "text.primary", mr: 1.5, height: 10 }}
        />
      );
    } else if (status === "loaded") {
      return <Check fontSize="small" sx={{ color: "green", mr: 1.5 }} />;
    } else {
      return <CircularProgress size={15} sx={{ mr: 2, ml: 0.5 }} />;
    }
  }

  useEffect(() => {
    async function load() {
      const folderRef = ref(storage, `${STORAGE_PATH}/${userId}/`);

      try {
        let fileBlob: Blob | undefined = fileResolution?.file;
        let fileName: string | undefined = fileResolution?.file?.name;
        if (loadingProgress.file === "loading") {
          const result = await listAll(folderRef);
          if (!(result.items.length > 0)) throw new Error("No files found.");
          const firstFileRef = result.items[0];
          fileBlob = await getBlob(firstFileRef);
          fileName = firstFileRef.name;
        }

        let jsonData: any[][] | undefined = fileResolution?.jsonData;
        if (loadingProgress.jsonData === "not loaded") {
          setLoadingProgress({
            file: "loaded",
            jsonData: "loading",
            rowsAndColumns: "not loaded",
          });

          jsonData = await getJsonDataFromFileAsync(fileBlob!);
        }

        let columns = fileResolution?.columns;
        let rows = fileResolution?.rows;
        if (!columns || !rows) {
          setLoadingProgress({
            jsonData: "loaded",
            file: "loaded",
            rowsAndColumns: "loading",
          });

          const { columns: _columns, rows: _rows } =
            await getColsAndRowsAsync(jsonData);
          columns = _columns;
          rows = _rows;

          setLoadingProgress({
            rowsAndColumns: "loaded",
            jsonData: "loaded",
            file: "loaded",
          });
        }

        setFileResolution({
          columns,
          rows,
          file: { ...fileBlob!, name: fileName! },
          jsonData,
        });

        if (extraStepsToLoad.length > 0) {
          for (let i = 0; i < extraStepsToLoad.length; i++) {
            setExtraStepsToLoad((prev) =>
              prev.map((step, index) => {
                if (index === i) {
                  return {
                    ...step,
                    status: "loading",
                  };
                }
                return step;
              })
            );
            await extraStepsToLoad[i].loader({ rows });
            setExtraStepsToLoad((prev) =>
              prev.map((step, index) => {
                if (index === i) {
                  return {
                    ...step,
                    status: "loaded",
                  };
                }
                return step;
              })
            );
          }
        }

        setTimeout(() => {
          setLoadCube(false);
          setExtraStepsToLoad([]);
        }, 500);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    if (loadCube) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCube]);

  return (
    <Dialog
      open={loadCube}
      onClose={() => setLoadCube(false)}
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <ViewInArIcon sx={{ mr: 2 }} />
        Cargando Cubo
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.file)} Cargar archivo
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.jsonData)} Formatear datos
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.rowsAndColumns)} Cargar filas
              y columnas
            </Typography>
          </Grid>
          {extraStepsToLoad.map((extraStep, index) => (
            <Grid item xs={12} key={index}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {getStatusIndicator(extraStep.status)} {extraStep.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CubeLoader;
