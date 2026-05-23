import { useEffect, useState } from "react";

import { EFileType } from "@shared/enums";
import { IFileData } from "@shared/models";
import { CornerDownRight, FileX, Trash2 } from "lucide-react";
import json from "src/assets/images/json.webp";
import xls from "src/assets/images/xls.svg";
import { ConfirmDialog } from "src/components";
import { useAuth, useCube } from "src/context/hooks";
import { getError } from "src/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        // The cube can be seeded directly into Firestore (admin scripts,
        // local dev) without ever touching Storage. In that case the
        // `getFiles` Cloud Function returns an error — that's fine, it
        // doesn't mean the cube is broken. Capture it for diagnostics
        // but fall back to the empty-state UI below.
        console.warn("getFiles failed; falling back to empty state", e);
        setError(getError(e));
        setFiles([]);
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
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
    );
  }

  // No tracked files (either Storage is empty or the cube was seeded
  // directly into Firestore). Show a calm empty state instead of a
  // destructive alert — the cube itself still works.
  if (!files?.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileX className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No hay archivos registrados</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {error
                ? "El cubo está activo pero no encontramos archivos asociados (puede haber sido sembrado directamente). Si quieres reemplazar los datos, borra el cubo y vuelve a importar."
                : "Aún no se han subido archivos al cubo. Vuelve a importar para registrar uno."}
            </p>
          </div>
          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar cubo y reimportar
            </Button>
          )}
        </CardContent>
        <ConfirmDialog
          title="Confirmar"
          description="Está seguro que desea borrar los datos del cubo?"
          open={isConfirmDialogOpen}
          handleClose={handleConfirmDialogOnClose}
          onAgree={handleDeleteCube}
          agreeText="Borrar"
          disagreeText="Cancelar"
        />
      </Card>
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
        {files.map((file) => (
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
