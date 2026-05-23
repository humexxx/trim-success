import { useEffect, useState } from "react";

import { EFileType } from "@shared/enums";
import { IFileData } from "@shared/models";
import { CornerDownRight, Loader2, Trash2 } from "lucide-react";
import json from "src/assets/images/json.webp";
import xls from "src/assets/images/xls.svg";
import { ConfirmDialog } from "src/components";
import { useAuth, useCube } from "src/context/hooks";
import { getError } from "src/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ImportedDataPage = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<IFileData[] | undefined>(undefined);

  const cube = useCube();
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const files = await cube.getFiles();
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
    } catch {
      throw new Error("Error deleting cube data");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
      <div className="flex flex-col gap-6">
        {files?.map((file) => (
          <div key={file.name} className="flex items-center gap-3">
            {file.type === EFileType.JSON && (
              <CornerDownRight className="ml-4 h-4 w-4 text-muted-foreground" />
            )}
            <img
              src={file.type === EFileType.JSON ? json : xls}
              width={file.type === EFileType.JSON ? 30 : 40}
              alt=""
            />
            <span className="text-sm">{file.name}</span>
            {isAdmin && file.type !== EFileType.JSON && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-2"
                onClick={() => setIsConfirmDialogOpen(true)}
              >
                <Trash2 />
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ImportedDataPage;
