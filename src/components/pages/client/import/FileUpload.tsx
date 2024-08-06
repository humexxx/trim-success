import { useState } from "react";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { storage } from "src/firebase";
import { useAuth } from "src/context/auth";
import { ref, uploadBytes } from "firebase/storage";
import { STORAGE_PATH } from "src/consts";
import { useCube } from "src/context/cube";

interface FileUploadProps {
  handleOnFinish: () => void;
}

const FileUpload = ({ handleOnFinish }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth();
  const cube = useCube();

  function handleOnClick() {
    if (!cube.fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setLoading(true);

    const storageRef = ref(
      storage,
      `${STORAGE_PATH}${user.currentUser!.uid}/${cube.fileResolution.file.name}`
    );
    uploadBytes(storageRef, cube.fileResolution.file)
      .then((snapshot) => {
        // console.log("Uploaded a file!", snapshot);
        // getDownloadURL(snapshot.ref).then((downloadURL) => {
        //   console.log("File available at", downloadURL);
        // });
      })
      .catch((error) => {
        setError(`Error al subir el archivo: ${error}`);
      })
      .finally(() => {
        setLoading(false);
        handleOnFinish();
      });
  }

  return (
    <>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <>{Boolean(error) && <Alert severity="error">{error}</Alert>}</>
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ mt: 1, mr: 1 }}
          disabled={loading}
        >
          Terminar
        </Button>
      </Box>
    </>
  );
};

export default FileUpload;
