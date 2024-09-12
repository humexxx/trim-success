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
}

interface LoadingProgress {
  file: "not loaded" | "loaded" | "loading";
  jasonData: "not loaded" | "loaded" | "loading";
  rowsAndColumns: "not loaded" | "loaded" | "loading";
}

const CubeLoader = ({
  setLoadCube,
  loadCube,
  userId,
  setFileResolution,
  setExtraStepsToLoad,
  extraStepsToLoad,
}: Props) => {
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    file: "loading",
    jasonData: "not loaded",
    rowsAndColumns: "not loaded",
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
    async function loadFile() {
      const folderRef = ref(storage, `${STORAGE_PATH}/${userId}/`);

      try {
        const result = await listAll(folderRef);
        if (result.items.length > 0) {
          const firstFileRef = result.items[0];
          const fileBlob = await getBlob(firstFileRef);

          setLoadingProgress({
            file: "loaded",
            jasonData: "loading",
            rowsAndColumns: "not loaded",
          });

          const jsonData = await getJsonDataFromFileAsync(fileBlob);

          setLoadingProgress({
            jasonData: "loaded",
            file: "loaded",
            rowsAndColumns: "loading",
          });

          const { columns, rows } = await getColsAndRowsAsync(jsonData);

          setLoadingProgress({
            rowsAndColumns: "loaded",
            jasonData: "loaded",
            file: "loaded",
          });

          setFileResolution({
            columns,
            rows,
            file: { ...fileBlob, name: firstFileRef.name },
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
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    if (loadCube) loadFile();
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
              {getStatusIndicator(loadingProgress.jasonData)} Formatear datos
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
