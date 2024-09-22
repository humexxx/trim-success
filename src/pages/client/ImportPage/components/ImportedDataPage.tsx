import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCube } from "src/context/cube";
import xls from "src/assets/images/xls.svg";
import { Delete } from "@mui/icons-material";
import { ConfirmDialog } from "src/components";
import { httpsCallable } from "firebase/functions";
import { functions } from "src/firebase";
import { useAuth } from "src/context/auth";

const ImportedDataPage = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<(Blob & { name: string })[] | undefined>(
    undefined
  );

  const cube = useCube();
  const { customUser, isAdmin } = useAuth();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const file = await cube.getFile();
        if (!file) throw new Error("No file found");
        setFiles([file]);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [cube]);

  function handleConfirmDialogOnClose(response: boolean) {
    setIsConfirmDialogOpen(false);
    if (response) {
      cube.setHasInitialData(false);
      cube.setData(undefined);
    }
  }

  async function handleDeleteCube() {
    try {
      const removeCubeData = httpsCallable(functions, "removeCubeData");
      await removeCubeData({ uid: customUser?.uid });
    } catch (e) {
      throw new Error("Error deleting cube data");
    }
  }

  if (loading)
    return (
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        <CircularProgress size={20} />
        <Typography variant="body1" color="text.primary">
          Loading...
        </Typography>
      </Stack>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <ConfirmDialog
        title="Confirmar"
        description="Está seguro que desea borrar los datos del cubo?"
        open={isConfirmDialogOpen}
        handleClose={handleConfirmDialogOnClose}
        onAgree={handleDeleteCube}
        agreeText="Borrar"
        disagreeText="Cancelar"
      />
      {files?.map((file) => (
        <Stack key={file.name} direction={"row"} gap={2} alignItems={"center"}>
          <img src={xls} width={50} height={50} />
          <Typography variant="body1" color="text.primary">
            {file.name}
          </Typography>
          {isAdmin && (
            <Button
              startIcon={<Delete />}
              variant={"contained"}
              color="error"
              sx={{ ml: 2 }}
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Stack>
      ))}
    </>
  );
};

export default ImportedDataPage;
