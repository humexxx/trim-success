import { useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { storage } from "src/firebase";
import { useAuth } from "src/context/auth";
import { ref, uploadBytes, UploadResult } from "firebase/storage";
import { JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import { useCube } from "src/context/cube";
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";
import ForwardIcon from "@mui/icons-material/Forward";
import { LoadingButton } from "@mui/lab";
import {
  getCategoriesDataRowsAsync,
  getCategoriesDataTotals,
  getDriversDataRows,
} from "src/utils";
import { IBaseData, ICubeData } from "@shared/models";
import { useBaseData } from "../../DataMining/hooks";
import { FileResolution } from "./ImportDataPage";
import { useScorecard } from "../../Scorecard/hooks";

interface Props {
  handleOnFinish: () => void;
  fileResolution: FileResolution;
}

const FileUpload = ({ handleOnFinish, fileResolution }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAdmin, customUser } = useAuth();
  const baseData = useBaseData();
  const scorecard = useScorecard();
  const cube = useCube();

  async function uploadJsonData(
    uid: string,
    jsonData: unknown[]
  ): Promise<UploadResult> {
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
    const storageRef = ref(
      storage,
      `${STORAGE_PATH}${uid}/${JSON_FILE_NAME}` // Puedes ajustar el nombre y la ruta según lo necesites
    );
    const snapshot = await uploadBytes(storageRef, jsonBlob);
    return snapshot;
  }

  async function handleOnClick() {
    if (!fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setLoading(true);

    try {
      const uid = isAdmin ? customUser!.uid : currentUser!.uid;
      const storageRef = ref(
        storage,
        `${STORAGE_PATH}${uid}/${fileResolution.file.name}`
      );
      const snapshot = await uploadBytes(storageRef, fileResolution.file);
      // getDownloadURL(snapshot.ref).then((downloadURL) => {
      //   console.log("File available at", downloadURL);
      // });

      // upload json data
      await uploadJsonData(uid, fileResolution.jsonData!);

      const drivers = cube.data!.paramsData.drivers!;
      const categoriesDataRows = await getCategoriesDataRowsAsync(
        fileResolution.rows!,
        drivers
      );
      const categoriesDataTotals = getCategoriesDataTotals(
        categoriesDataRows,
        drivers
      );

      const driversFirstData = getDriversDataRows(
        drivers,
        categoriesDataRows,
        categoriesDataTotals
      );
      const _baseData: IBaseData = {
        categoriesData: {
          rows: categoriesDataRows,
          totals: categoriesDataTotals,
        },
        driversData: { rows: driversFirstData },
      };

      await baseData.update(_baseData);
      cube.setData((prev) => ({
        ...(prev as ICubeData),
        baseData: _baseData,
      }));

      const response = await scorecard.calculate();
      const data = response.data as { error?: string };
      if ("error" in data) {
        throw new Error(data.error);
      }

      await cube.reloadCubeData();
    } catch (error) {
      setError(`Error al subir el archivo: ${error}`);
    } finally {
      setLoading(false);
      handleOnFinish();
    }
  }

  if (error) {
    <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Typography color="text.primary" mt={2}>
        Los datos cargados se usarán para crear los distintos reportes.
      </Typography>
      <Grid container mx={4} my={8}>
        <Grid item xs={2}>
          <DevicesIcon sx={{ scale: "2", color: "text.primary" }} />
        </Grid>
        <Grid item xs={2}>
          <ForwardIcon
            sx={{
              color: "text.primary",
              scale: "2",
              animation: "moveFade 1s ease-in-out infinite",
              "@keyframes moveFade": {
                "0%": {
                  transform: "translateX(0)",
                  opacity: 1,
                },
                "50%": {
                  transform: "translateX(10px)",
                  opacity: 0.5,
                },
                "100%": {
                  transform: "translateX(0)",
                  opacity: 1,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <StorageIcon sx={{ scale: "2", color: "text.primary" }} />
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <LoadingButton
          variant="contained"
          onClick={handleOnClick}
          sx={{ mt: 1, mr: 1 }}
          loading={loading}
        >
          Terminar
        </LoadingButton>
      </Box>
    </>
  );
};

export default FileUpload;
