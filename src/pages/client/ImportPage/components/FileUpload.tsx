import { useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { storage } from "src/firebase";
import { useAuth } from "src/context/auth";
import { ref, uploadBytes } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";
import { useCube } from "src/context/cube";
import DevicesIcon from "@mui/icons-material/Devices";
import StorageIcon from "@mui/icons-material/Storage";
import ForwardIcon from "@mui/icons-material/Forward";
import { LoadingButton } from "@mui/lab";
import { useDataParams } from "../../GeneralData/hooks";

interface FileUploadProps {
  handleOnFinish: () => void;
}

const FileUpload = ({ handleOnFinish }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateDataParams } = useDataParams({ autoload: false });
  const user = useAuth();
  const {
    fileResolution,
    dataParams: { data: dataParams },
  } = useCube();

  async function handleOnClick() {
    if (!fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(
        storage,
        `${STORAGE_PATH}${user.currentUser!.uid}/${fileResolution.file.name}`
      );
      const snapshot = await uploadBytes(storageRef, fileResolution.file);
      console.log("Uploaded a file!", snapshot);
      // getDownloadURL(snapshot.ref).then((downloadURL) => {
      //   console.log("File available at", downloadURL);
      // });
      await updateDataParams(dataParams!);
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
