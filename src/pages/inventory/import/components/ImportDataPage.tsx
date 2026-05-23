import { ReactNode, useState } from "react";

import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import DriversStep from "./DriversStep";
import DropzoneStep from "./DropzoneStep";
import FileUploadStep from "./FileUploadStep";

export interface FileResolution {
  jsonData?: unknown[];
  rows?: string[];
  columns?: string[];
  file?: File;
  sheetName?: string;
}

interface StepDef {
  label: string;
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
 * Vercel-style import wizard: horizontal progress strip at the top,
 * a single elevated card for the active step, and a sticky footer
 * with Atrás / Continuar actions. Replaces the previous vertical-
 * numbered MUI-flavored stepper.
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
      label: "Importar archivo",
      description: "Sube el Excel con los datos del cubo (.xlsx o .xls).",
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
      description:
        "Selecciona los drivers de negocio que se van a usar en el análisis.",
      body: () => <DriversStep />,
    },
    {
      label: "Carga de datos",
      description:
        "Procesamos el archivo y generamos los reportes. Toma un par de minutos.",
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
  const canAdvance =
    activeStep === 0
      ? Boolean(fileResolution?.file)
      : activeStep === 1
        ? true
        : false; // last step has its own submit button

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Stepper
        steps={steps.map((s) => s.label)}
        activeStep={activeStep}
      />

      <Card className="mt-6">
        <CardContent className="space-y-6 p-6 md:p-8">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Paso {activeStep + 1} de {steps.length}
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              {current.label}
            </h2>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </header>

          <div>{current.body(ctx)}</div>

          {!isLast && (
            <footer className="flex items-center justify-between border-t pt-4">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StepperProps {
  steps: string[];
  activeStep: number;
}

function Stepper({ steps, activeStep }: StepperProps) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((label, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        const showConnector = idx < steps.length - 1;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-3">
              <span
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  isCompleted &&
                    "border-foreground bg-foreground text-background",
                  isActive &&
                    "border-foreground bg-background text-foreground ring-4 ring-foreground/5",
                  !isActive &&
                    !isCompleted &&
                    "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium md:inline",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {showConnector && (
              <span
                aria-hidden="true"
                className={cn(
                  "h-px flex-1 transition-colors",
                  idx < activeStep ? "bg-foreground" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
