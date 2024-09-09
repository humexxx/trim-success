import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Dropzone,
  FileSummary,
  FileUpload,
} from "src/pages/client/ImportPage/components";
import { useCube } from "src/context/cube";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";
import { LoadingButton } from "@mui/lab";

export default function Page() {
  useDocumentMetadata("Importar Datos - Trim Success");
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cube = useCube();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOnFinish = () => {
    navigate("/client/dashboard");
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel
            optional={
              <Typography variant="caption">
                Archivo base para todas las operaciones
              </Typography>
            }
          >
            Importar Archivo
          </StepLabel>
          <StepContent>
            <Dropzone setLoading={setLoading} loading={loading} />
            <StepperFooter
              handleBack={handleBack}
              handleNext={handleNext}
              isFirstStep
              disableNext={!cube.fileResolution?.jsonData?.length}
              loading={loading}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              <Typography variant="caption">
                Verifica las columnas y las filas
              </Typography>
            }
          >
            Verificar Datos
          </StepLabel>
          <StepContent>
            <FileSummary error={stepError} setError={setStepError} />
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
            <FileUpload handleOnFinish={handleOnFinish} />
          </StepContent>
        </Step>
      </Stepper>
    </Box>
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
        >
          Continuar
        </LoadingButton>
      </div>
    </Box>
  );
}
