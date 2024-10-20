import { useState } from "react";

import DevicesIcon from "@mui/icons-material/Devices";
import ForwardIcon from "@mui/icons-material/Forward";
import StorageIcon from "@mui/icons-material/Storage";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { STORAGE_PATH } from "@shared/consts";
import { collection, doc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useAuth } from "src/context/hooks";
import { useCube } from "src/context/cube";
import { firestore, storage } from "src/firebase";

import { FileResolution } from "./ImportDataPage";

interface Props {
  handleOnFinish: () => void;
  fileResolution: FileResolution;
}

const FileUpload = ({ handleOnFinish, fileResolution }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAdmin, customUser } = useAuth();
  const cube = useCube();

  async function handleOnClick() {
    if (!fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const uid = isAdmin ? customUser!.uid : currentUser!.uid;
      const generateUID = doc(collection(firestore, "random")).id;

      const storageRef = ref(storage, `${STORAGE_PATH}/${uid}/${generateUID}`);
      await uploadBytes(storageRef, fileResolution.file);
      await cube.initCube(generateUID, cube.data!.paramsData);
      await cube.reloadCubeData();
      handleOnFinish();
    } catch (error) {
      setError(`Error al subir el archivo: ${error}`);
      await cube.removeCube();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {Boolean(error) && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Alert severity="info">Esto puede tardar un par de minutos...</Alert>
      )}
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
          Cargar Datos y Terminar
        </LoadingButton>
      </Box>
    </>
  );
};

export default FileUpload;
