import { useEffect, useMemo, useState } from "react";

import { EDriverType, EFileType } from "@shared/enums";
import { IFileData } from "@shared/models";
import {
  CheckCircle2,
  CornerDownRight,
  Database,
  Trash2,
} from "lucide-react";
import json from "src/assets/images/json.webp";
import xls from "src/assets/images/xls.svg";
import { ConfirmDialog } from "src/components";
import { useAuth, useCube } from "src/context/hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ImportedDataPage = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
        // The cube can be seeded directly into Firestore (admin
        // scripts, local dev) without ever touching Storage. In that
        // case `getFiles` returns an error — that doesn't mean the cube
        // is broken, just that we have no Storage manifest to display.
        // Fall back to the cube-summary card rendered below.
        console.warn("getFiles failed; falling back to cube summary", e);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [cube]);

  // Quick read of the cube itself so we can show "cubo activo" even
  // when Storage has no files. Same numbers shown on the ModuleSelector
  // card so the two views agree.
  const cubeSummary = useMemo(() => {
    const data = cube.data;
    if (!data?.baseData?.categoriesData) return null;
    const totals = data.baseData.categoriesData.totals;
    return {
      categoryCount: data.cubeParameters.categories?.length ?? 0,
      skus: Number(totals[EDriverType.SKUS] ?? 0),
      sales: Number(totals[EDriverType.SALES] ?? 0),
    };
  }, [cube.data]);

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

      <div className="flex flex-col gap-4">
        {/* Cube summary card — always present when the cube is
            loaded. This is the source of truth for "do I have data?",
            independent of whether Storage has a backing file. */}
        {cubeSummary && (
          <Card>
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/40 text-foreground">
                  <Database className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">Cubo activo</p>
                    <Badge
                      variant="outline"
                      className="gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Listo
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cubeSummary.skus.toLocaleString("en-US")} SKUs ·{" "}
                    {cubeSummary.categoryCount} categorías
                  </p>
                </div>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfirmDialogOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Borrar y reimportar
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Storage-backed files, if any. Hidden entirely when Storage
            returned nothing — the cube card above already communicates
            "data is loaded". */}
        {files && files.length > 0 && (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ImportedDataPage;
