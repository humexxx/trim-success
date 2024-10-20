import { useEffect, useState } from "react";

import { CurrencyBitcoinRounded, Delete } from "@mui/icons-material";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { EFileType } from "@shared/enums";
import { httpsCallable } from "firebase/functions";
import json from "src/assets/images/json.webp";
import xls from "src/assets/images/xls.svg";
import { ConfirmDialog } from "src/components";
import { useAuth } from "src/context/hooks";
import { useCube } from "src/context/cube";
import { functions } from "src/firebase";
import { getError } from "src/utils";

const ImportedDataPage = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<
    { name: string; blob: Blob }[] | undefined
  >(undefined);

  const cube = useCube();
  const { customUser, isAdmin } = useAuth();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const files = await cube.getFiles();
        if (!files?.length) throw new Error("No files found");
        setFiles(files);
      } catch (e) {
        setError(getError(e));
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
      await cube.removeCube();
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
      <Stack direction={"column"} gap={4}>
        {files?.map((file) => (
          <Stack
            key={file.name}
            direction={"row"}
            gap={2}
            alignItems={"center"}
          >
            {file.blob.type === EFileType.JSON && (
              <SubdirectoryArrowRightIcon sx={{ ml: 2 }} />
            )}
            <img
              src={file.blob.type === EFileType.JSON ? json : xls}
              width={file.blob.type === EFileType.JSON ? 30 : 40}
            />
            <Typography variant="body1" color="text.primary">
              {file.name}
            </Typography>
            {isAdmin && file.blob.type !== EFileType.JSON && (
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
      </Stack>
    </>
  );
};

export default ImportedDataPage;
