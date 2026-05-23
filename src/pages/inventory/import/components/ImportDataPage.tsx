import { ReactNode, useState } from "react";

import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import DriversStep from "./DriversStep";
import DropzoneStep from "./DropzoneStep";
import FileUploadStep from "./FileUploadStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


export interface FileResolution {
  jsonData?: unknown[];
  rows?: string[];
  columns?: string[];
  file?: File;
  sheetName?: string;
}

interface StepDef {
  label: string;
  shortLabel: string;
  description: string;
  body: (ctx: StepCtx) => ReactNode;
}

interface StepCtx {
  fileResolution: FileResolution | undefined;
  setFileResolution: (f: FileResolution | undefined) => void;
  goNext: () => void;
  goBack: () => void;
  finish: () => void;
}

/**
 * Two-column wizard pattern (matches Vercel "New Project" / Stripe
 * onboarding): the stepper sits as a sticky sidebar on the left and
 * the active step's content owns the right side. The PageHeader above
 * provides the page-level context so the card doesn't need to repeat
 * the "Importar" h1 — keeps the visual rhythm in line with
 * ModuleSelector / Sales (PageHeader + content area below).
 */
export default function ImportDataPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);

  const navigate = useNavigate();
  const cube = useCube();

  const steps: StepDef[] = [
    {
      label: "Subir archivo Excel",
      shortLabel: "Archivo",
      description: "Sube el .xlsx o .xls con los datos del cubo.",
      body: ({ setFileResolution, goNext }) => (
        <DropzoneStep
          handleNext={(file: File) => {
            setFileResolution({ file });
            goNext();
          }}
        />
      ),
    },
    {
      label: "Verificar drivers",
      shortLabel: "Drivers",
      description:
        "Selecciona qué drivers de negocio entran al análisis.",
      body: () => <DriversStep />,
    },
    {
      label: "Cargar y procesar",
      shortLabel: "Cargar",
      description:
        "Subimos el archivo y generamos los reportes. Toma un par de minutos.",
      body: ({ fileResolution, finish }) => (
        <FileUploadStep
          fileResolution={fileResolution!}
          handleOnFinish={finish}
        />
      ),
    },
  ];

  const ctx: StepCtx = {
    fileResolution,
    setFileResolution,
    goNext: () => setActiveStep((s) => Math.min(s + 1, steps.length - 1)),
    goBack: () => setActiveStep((s) => Math.max(s - 1, 0)),
    finish: () => {
      cube.setHasInitialData(true);
      navigate(ROUTES.INVENTORY.DASHBOARD);
    },
  };

  const current = steps[activeStep]!;
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;
  const canAdvance = activeStep === 0 ? Boolean(fileResolution?.file) : true;

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left: step list, sticky on tall content */}
        <aside className="border-b bg-muted/30 p-6 md:border-b-0 md:border-r">
          <ol className="space-y-1" aria-label="Pasos">
            {steps.map((s, idx) => {
              const completed = idx < activeStep;
              const active = idx === activeStep;
              return (
                <li key={s.label}>
                  <div
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "flex items-start gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active && "bg-background shadow-sm"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-semibold",
                        completed &&
                          "border-foreground bg-foreground text-background",
                        active &&
                          "border-foreground bg-background text-foreground",
                        !active &&
                          !completed &&
                          "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {completed ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "font-medium leading-tight",
                          !active && !completed && "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </div>
                      {active && (
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {s.description}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Right: active step body + footer */}
        <CardContent className="flex flex-col gap-6 p-6 md:p-8">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Paso {activeStep + 1} de {steps.length} · {current.shortLabel}
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              {current.label}
            </h2>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </header>

          <Separator />

          <div className="min-h-[260px]">{current.body(ctx)}</div>

          {!isLast && (
            <>
              <Separator />
              <footer className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={ctx.goBack}
                  disabled={isFirst}
                  className="gap-1"
                >
                  <ChevronLeft />
                  Atrás
                </Button>
                <Button
                  size="sm"
                  onClick={ctx.goNext}
                  disabled={!canAdvance}
                >
                  Continuar
                </Button>
              </footer>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
