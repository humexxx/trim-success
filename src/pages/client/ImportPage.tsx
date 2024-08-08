import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  AdminClientSelector,
  Dropzone,
  FileSummary,
  FileUpload,
} from "src/components/pages/client/import";
import { useCube } from "src/context/cube";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/auth";
import { useDocumentMetadata } from "src/hooks";

export default function ImportPage() {
  useDocumentMetadata("Importar Datos - Trim Success");
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const cube = useCube();
  const user = useAuth();

  useEffect(() => {
    if (!cube.loading && cube.fileResolution && !user.currentUser!.isAdmin) {
      navigate("/client/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cube.loading, navigate]);

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
      {user.currentUser!.isAdmin ? (
        <>
          <Typography variant="h6">Cargar Archivo de Usuario</Typography>
          <Typography variant="caption">
            Como eres administrador, puedes cargar un archivo de usuario
          </Typography>
          <AdminClientSelector />
        </>
      ) : (
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
              <Dropzone />
              <StepperFooter
                handleBack={handleBack}
                handleNext={handleNext}
                isFirstStep
                disableNext={!cube.fileResolution?.jsonData?.length}
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
              <FileSummary />
              <StepperFooter handleBack={handleBack} handleNext={handleNext} />
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
              <Typography color="text.primary" variant="h6">
                Los datos cargados se usarán para crear los distintos reportes.
              </Typography>
              <FileUpload handleOnFinish={handleOnFinish} />
            </StepContent>
          </Step>
        </Stepper>
      )}
    </Box>
  );
}

interface StepperFooterProps {
  isFirstStep?: boolean;
  handleBack: () => void;
  handleNext: () => void;
  disableNext?: boolean;
}

function StepperFooter({
  isFirstStep = false,
  handleBack,
  handleNext,
  disableNext,
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
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 1, mr: 1 }}
          disabled={disableNext}
        >
          Continuar
        </Button>
      </div>
    </Box>
  );
}
