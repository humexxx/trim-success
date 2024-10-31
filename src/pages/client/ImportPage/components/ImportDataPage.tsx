import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useCube } from "src/context/hooks";
import {
  DropzoneStep,
  FileUploadStep,
  DriversStep,
} from "src/pages/client/ImportPage/components";

export interface FileResolution {
  jsonData?: unknown[];
  rows?: string[];
  columns?: string[];
  file?: File;
  sheetName?: string;
}

export default function ImportDataPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);

  const navigate = useNavigate();
  const cube = useCube();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setStepError("");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOnFinish = () => {
    cube.setHasInitialData(true);
    navigate("/client/dashboard");
  };

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>Importar Archivo</StepLabel>
        <StepContent>
          <StepContentWrapper>
            <DropzoneStep
              handleNext={(file: File) => {
                setFileResolution({ file });
                handleNext();
              }}
            />
          </StepContentWrapper>
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleNext}
            isFirstStep
            disableNext={!fileResolution?.file || !fileResolution.jsonData}
          />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Verificar Drivers</StepLabel>
        <StepContent>
          <StepContentWrapper>
            <DriversStep />
          </StepContentWrapper>
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={Boolean(stepError)}
          />
        </StepContent>
      </Step>
      <Step>
        <StepLabel
          optional={
            <Typography variant="caption">
              Carga de datos al sistema para la generación de reportes
            </Typography>
          }
        >
          Carga de datos
        </StepLabel>
        <StepContent>
          <StepContentWrapper>
            <FileUploadStep
              fileResolution={fileResolution!}
              handleOnFinish={handleOnFinish}
            />
          </StepContentWrapper>
        </StepContent>
      </Step>
    </Stepper>
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
    <Box sx={{ my: 2 }}>
      <div>
        <Button
          disabled={isFirstStep}
          onClick={handleBack}
          sx={{ mt: 1, mr: 1 }}
        >
          Atrás
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 1, mr: 1 }}
          disabled={disableNext}
          loading={loading}
          disableElevation
        >
          Continuar
        </LoadingButton>
      </div>
    </Box>
  );
}

function StepContentWrapper({ children }: { children: React.ReactNode }) {
  return <Box sx={{ m: 2 }}>{children}</Box>;
}
