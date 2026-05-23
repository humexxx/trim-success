import { useCallback, useState } from "react";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface Props {
  handleNext: (file: File) => void;
}

const DropzoneStep = ({ handleNext }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setAccepted(file);
      setError(null);
      handleNext(file);
    },
    [handleNext]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100_000_000,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    onDropRejected: (rejections) => {
      console.error(rejections);
      setError("Archivo no válido. Solo se aceptan .xlsx o .xls.");
    },
  });

  return (
    <div className="max-w-xl space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background p-10 text-center transition-colors hover:border-primary",
          isDragActive && "border-primary bg-accent"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-foreground">
          Arrastra un archivo Excel aquí o haz clic para seleccionar uno
        </p>
        <p className="mt-1 text-xs text-muted-foreground">.xlsx o .xls — máx 100 MB</p>
      </div>

      {accepted && (
        <p className="text-sm text-muted-foreground">
          Vista previa: <span className="font-medium">{accepted.name}</span>
        </p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DropzoneStep;
