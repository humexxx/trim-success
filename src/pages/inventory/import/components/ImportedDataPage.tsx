import { useEffect, useMemo, useState } from "react";

import { EAmountType, EDriverType, EFileType } from "@shared/enums";
import { IFileData } from "@shared/models";
import { formatAmount } from "@shared/utils";
import {
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  Trash2,
} from "lucide-react";
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
      drivers: data.cubeParameters.drivers ?? [],
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
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const hasFiles = files && files.length > 0;

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
        {/* Cube summary — always present when the cube is loaded. This
            is the source of truth for "do I have data?", independent of
            whether Storage has a backing file. */}
        {cubeSummary && (
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Detail card: file list (when available) + cube stats below */}
        {cubeSummary && (
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-semibold">
                {hasFiles ? "Archivos del cubo" : "Detalle del cubo"}
              </h3>

              {hasFiles && (
                <ul className="divide-y">
                  {files!.map((file) => {
                    const isJson = file.type === EFileType.JSON;
                    return (
                      <li
                        key={file.name}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground">
                          {isJson ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <FileSpreadsheet className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.name}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {isJson ? "JSON" : "XLSX"}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div
                className={`grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 ${
                  hasFiles ? "mt-5 border-t pt-4" : ""
                }`}
              >
                <Stat
                  label="Categorías"
                  value={cubeSummary.categoryCount.toLocaleString("en-US")}
                />
                <Stat
                  label="SKUs activos"
                  value={cubeSummary.skus.toLocaleString("en-US")}
                />
                <Stat
                  label="Ventas"
                  value={
                    cubeSummary.sales > 0
                      ? formatAmount(cubeSummary.sales, EAmountType.MILLIS)
                      : "—"
                  }
                />
              </div>

              {cubeSummary.drivers.length > 0 && (
                <div className="mt-5 border-t pt-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Drivers configurados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cubeSummary.drivers.map((d) => (
                      <span
                        key={d.key}
                        className="inline-flex items-center gap-1.5 rounded-md border bg-muted/30 px-2 py-1 text-xs"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            d.required
                              ? "bg-emerald-500"
                              : "bg-muted-foreground/60"
                          }`}
                        />
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

export default ImportedDataPage;
