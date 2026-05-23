import { ReactNode, useState } from "react";

import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { Button } from "@/components/ui/button";
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
  optional?: ReactNode;
  body: ReactNode;
}

export default function ImportDataPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);

  const navigate = useNavigate();
  const cube = useCube();

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => {
    setStepError("");
    setActiveStep((s) => s - 1);
  };
  const handleOnFinish = () => {
    cube.setHasInitialData(true);
    navigate(ROUTES.INVENTORY.DASHBOARD);
  };

  const steps: StepDef[] = [
    {
      label: "Importar Archivo",
      body: (
        <>
          <DropzoneStep
            handleNext={(file: File) => {
              setFileResolution({ file });
              handleNext();
            }}
          />
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleNext}
            isFirstStep
            disableNext={!fileResolution?.file || !fileResolution.jsonData}
          />
        </>
      ),
    },
    {
      label: "Verificar Drivers",
      body: (
        <>
          <DriversStep />
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={Boolean(stepError)}
          />
        </>
      ),
    },
    {
      label: "Carga de datos",
      optional: (
        <span className="text-xs text-muted-foreground">
          Carga de datos al sistema para la generación de reportes
        </span>
      ),
      body: (
        <FileUploadStep
          fileResolution={fileResolution!}
          handleOnFinish={handleOnFinish}
        />
      ),
    },
  ];

  return (
    <ol className="relative space-y-6 border-l border-border pl-8">
      {steps.map((step, idx) => {
        const isActive = activeStep === idx;
        const isCompleted = activeStep > idx;
        return (
          <li key={step.label} className="relative">
            <span
              className={cn(
                "absolute -left-[2.45rem] flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ring-4 ring-background",
                isCompleted
                  ? "border-foreground bg-foreground text-background"
                  : isActive
                    ? "border-foreground bg-background text-foreground"
                    : "border-border bg-background text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
            </span>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-medium",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {step.optional}
              {isActive && <div className="mt-3">{step.body}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

interface StepperFooterProps {
  isFirstStep?: boolean;
  handleBack: () => void;
  handleNext: () => void;
  disableNext?: boolean;
  loading?: boolean;
}

function StepperFooter({
  isFirstStep = false,
  handleBack,
  handleNext,
  disableNext,
  loading = false,
}: StepperFooterProps) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <Button variant="ghost" onClick={handleBack} disabled={isFirstStep}>
        Atrás
      </Button>
      <Button onClick={handleNext} disabled={disableNext} loading={loading}>
        Continuar
      </Button>
    </div>
  );
}
