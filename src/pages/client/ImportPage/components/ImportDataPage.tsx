import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ParamsDataStep,
  DropzoneStep,
  FileSummaryStep,
  FileUploadStep,
  DriversStep,
  SelectSheetStep,
} from "src/pages/client/ImportPage/components";
import { useCube } from "src/context/cube";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { getError, getJsonDataFromWorkbookAsync } from "src/utils";
import * as XLSX from "xlsx";

export interface FileResolution {
  jsonData?: unknown[];
  rows?: string[];
  columns?: string[];
  file?: File;
  sheetName?: string;
  workbook?: XLSX.WorkBook;
}

export default function ImportDataPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fileResolution, setFileResolution] = useState<
    FileResolution | undefined
  >(undefined);

  const navigate = useNavigate();
  const cube = useCube();
  const paramsDataComponentRef = useRef<{ saveData: () => void }>(null);

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

  async function handleSelectSheetStepOnNext() {
    if (!fileResolution) return;
    setLoading(true);

    try {
      const jsonData = await getJsonDataFromWorkbookAsync(
        fileResolution.workbook!,
        fileResolution.sheetName!
      );
      setFileResolution({
        ...fileResolution,
        jsonData,
      });
      handleNext();
    } catch (e) {
      setStepError(getError(e));
    } finally {
      setLoading(false);
    }
  }

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
        <StepLabel
          optional={
            <Typography variant="caption">
              Formatear archivo y seleccionar la hoja de trabajo
            </Typography>
          }
        >
          Formatear Archivo
        </StepLabel>
        <StepContent>
          <StepContentWrapper>
            <SelectSheetStep
              fileResolution={fileResolution!}
              setFileResolution={setFileResolution}
            />
          </StepContentWrapper>
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleSelectSheetStepOnNext}
            isFirstStep
            loading={loading}
            disableNext={!fileResolution?.sheetName}
          />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Verificar Datos</StepLabel>
        <StepContent>
          <StepContentWrapper>
            <FileSummaryStep
              error={stepError}
              setError={setStepError}
              setLoading={setLoading}
              fileResolution={fileResolution!}
              setFileResolution={setFileResolution}
              loading={loading}
            />
          </StepContentWrapper>
          <StepperFooter
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={Boolean(stepError) || loading}
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
            disableNext={Boolean(stepError) || loading}
          />
        </StepContent>
      </Step>
      <Step>
        <StepLabel
          optional={
            <Typography variant="caption">
              Parametros para la generación de reportes
            </Typography>
          }
        >
          Verificar Parametros
        </StepLabel>
        <StepContent>
          <StepContentWrapper>
            <ParamsDataStep
              ref={paramsDataComponentRef}
              error={stepError}
              setError={setStepError}
              setLoading={setLoading}
              loading={loading}
              fileResolution={fileResolution!}
            />
          </StepContentWrapper>
          <StepperFooter
            handleBack={handleBack}
            handleNext={() => {
              paramsDataComponentRef.current?.saveData();
              handleNext();
            }}
            disableNext={Boolean(stepError) || loading}
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
