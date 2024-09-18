import { useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { functions, storage } from "src/firebase";
import { useAuth } from "src/context/auth";
import { ref, uploadBytes } from "firebase/storage";
import { DRIVERS, STORAGE_PATH } from "src/consts";
import { useCube } from "src/context/cube";
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";
import ForwardIcon from "@mui/icons-material/Forward";
import { LoadingButton } from "@mui/lab";
import { FileResolution } from "../Page";
import { getCategoriesDataAsync, getDriversData } from "src/utils";
import { IBaseData, ICubeData } from "src/models";
import { httpsCallable } from "firebase/functions";
import { useBaseData } from "../../DataMining/hooks";

interface Props {
  handleOnFinish: () => void;
  fileResolution: FileResolution;
}

const FileUpload = ({ handleOnFinish, fileResolution }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const baseData = useBaseData(currentUser!.uid);
  const cube = useCube();

  async function handleOnClick() {
    if (!fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(
        storage,
        `${STORAGE_PATH}${currentUser!.uid}/${fileResolution.file.name}`
      );
      const snapshot = await uploadBytes(storageRef, fileResolution.file);
      // getDownloadURL(snapshot.ref).then((downloadURL) => {
      //   console.log("File available at", downloadURL);
      // });

      const categoriesData = await getCategoriesDataAsync(fileResolution.rows!);
      const categoriesDataTotals = {
        category: "Total",
        ...DRIVERS.filter((x) => !x.catHiddenByDefault).reduce(
          (acc, driver) => {
            acc[driver.name] = categoriesData.reduce(
              (acc, row) => acc + (row[driver.name] as number),
              0
            );
            return acc;
          },
          {} as Omit<
            IBaseData["categoriesData"]["totals"],
            "category" | "grossMargin"
          >
        ),
        grossMargin: categoriesData.reduce(
          (acc, row) => acc + row.grossMargin,
          0
        ),
      } as IBaseData["categoriesData"]["totals"];

      const driversFirstData = getDriversData(
        categoriesData,
        categoriesDataTotals
      );
      const _baseData: IBaseData = {
        categoriesData: {
          rows: categoriesData,
          totals: categoriesDataTotals,
        },
        driversData: { rows: driversFirstData },
      };

      await baseData.update(_baseData);
      cube.setData((prev) => ({
        ...(prev as ICubeData),
        baseData: _baseData,
      }));

      const scorecardFunction = httpsCallable(functions, "createScorecardData");
      const response = await scorecardFunction();
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
