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
import { functions } from "src/firebase";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ErrorIcon from "@mui/icons-material/Error";
import { httpsCallable } from "firebase/functions";
import { ICubeData } from "src/models";

interface Props {
  loadCube: boolean;
  setLoadCube: (value: boolean) => void;
  uid?: string;
  setData: (value: ICubeData | undefined) => void;
}

interface LoadingProgress {
  baseData: "not loaded" | "loaded" | "loading" | "error";
  scorecardData: "not loaded" | "loaded" | "loading" | "error";
  cubeData: "not loaded" | "loaded" | "loading" | "error";
}

const CubeLoader = ({ setLoadCube, loadCube, setData, uid }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    baseData: "not loaded",
    scorecardData: "not loaded",
    cubeData: "not loaded",
  });

  function getStatusIndicator(
    status: "not loaded" | "loaded" | "loading" | "error"
  ) {
    if (status === "not loaded") {
      return (
        <FiberManualRecordIcon
          sx={{ color: "text.primary", mr: 1.5, height: 10 }}
        />
      );
    } else if (status === "loaded") {
      return <Check fontSize="small" sx={{ color: "green", mr: 1.5 }} />;
    } else if (status === "loading") {
      return <CircularProgress size={15} sx={{ mr: 2, ml: 0.5 }} />;
    } else {
      return <ErrorIcon sx={{ color: "error.main", mr: 1.5 }} />;
    }
  }

  useEffect(() => {
    async function load() {
      try {
        setLoadingProgress({
          baseData: "loading",
          scorecardData: "not loaded",
          cubeData: "not loaded",
        });
        const createBaseData = httpsCallable(functions, "createBaseData");
        const createBaseDataResponse = await createBaseData(
          uid ? { uid } : null
        );
        const createBaseDataResponseData = createBaseDataResponse.data as {
          error: string;
          success: boolean;
        };
        if (!createBaseDataResponseData.success) {
          setLoadingProgress({
            baseData: "error",
            scorecardData: "not loaded",
            cubeData: "not loaded",
          });
          throw new Error(createBaseDataResponseData.error);
        }

        setLoadingProgress({
          baseData: "loaded",
          scorecardData: "loading",
          cubeData: "not loaded",
        });

        const createScorecardData = httpsCallable(
          functions,
          "createScorecardData"
        );
        const createScorecardDataResponse = await createScorecardData(
          uid ? { uid } : null
        );
        const createScorecardDataResponseData =
          createScorecardDataResponse.data as {
            error: string;
            success: boolean;
          };
        if (!createScorecardDataResponseData.success) {
          setLoadingProgress({
            baseData: "loaded",
            scorecardData: "error",
            cubeData: "not loaded",
          });
          throw new Error(createScorecardDataResponseData.error);
        }
        setLoadingProgress({
          baseData: "loaded",
          scorecardData: "loaded",
          cubeData: "loading",
        });

        const getCubeData = httpsCallable(functions, "getCubeData");
        const response = await getCubeData(uid ? { uid } : null);
        const data = response.data as ICubeData | { error: string };
        if ("error" in data) {
          setLoadingProgress({
            baseData: "loaded",
            scorecardData: "loaded",
            cubeData: "error",
          });
          throw new Error(data.error);
        }

        setLoadingProgress({
          baseData: "loaded",
          scorecardData: "loaded",
          cubeData: "loaded",
        });

        setTimeout(() => {
          setData(data);
          setLoadCube(false);
        }, 500);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }
    }

    if (loadCube) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCube]);

  return (
    <Dialog
      open={loadCube}
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
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.baseData)} Generando reportes
              escenciales
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.scorecardData)} Generando
              reportes de scorecard
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getStatusIndicator(loadingProgress.cubeData)} Cargando datos
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CubeLoader;
