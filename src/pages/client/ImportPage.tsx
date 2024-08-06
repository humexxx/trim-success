import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Dropzone, FileSummary } from "src/components/pages/client/import";

export default function ImportPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [jsonData, setJsonData] = React.useState<any[][]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
            <Dropzone
              onJsonDataChange={(data: any[][]) => {
                setJsonData(data);
              }}
            />
            <StepperFooter
              handleBack={handleBack}
              handleNext={handleNext}
              isFirstStep
              disableNext={jsonData.length === 0}
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
            <FileSummary jsonData={jsonData} />
            <StepperFooter handleBack={handleBack} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              <Typography variant="caption">
                Marca los reportes por generar
              </Typography>
            }
          >
            Reportes por Generar
          </StepLabel>
          <StepContent>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quae
              dolores laboriosam architecto obcaecati voluptate saepe delectus
              velit accusantium veritatis dolore nihil, consequuntur,
              praesentium dignissimos! Eaque magnam aperiam magni molestiae!
            </Typography>
            <StepperFooter
              handleBack={handleBack}
              handleNext={handleNext}
              isLastStep
            />
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 3 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Todos los pasos han sido completados</Typography>
          <Typography>
            Hacer algo mas aqui, como enviar los datos al servidor
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1 }}>
            Reiniciar
          </Button>
        </Paper>
      )}
    </Box>
  );
}

interface StepperFooterProps {
  isLastStep?: boolean;
  isFirstStep?: boolean;
  handleBack: () => void;
  handleNext: () => void;
  disableNext?: boolean;
}

function StepperFooter({
  isFirstStep = false,
  isLastStep = false,
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
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 1, mr: 1 }}
          disabled={disableNext}
        >
          {isLastStep ? "Terminar" : "Continuar"}
        </Button>
      </div>
    </Box>
  );
}
