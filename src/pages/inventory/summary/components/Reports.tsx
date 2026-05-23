import { useState } from "react";

import { FileText } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { CardButton } from "src/components";
import { getError } from "src/utils";

import { useReportsGenerator } from "../hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";


const Reports = () => {
  const reportsGenerator = useReportsGenerator();
  const [error, setError] = useState<string | null>(null);

  async function generateGeneralReport() {
    setError(null);
    try {
      const response = await reportsGenerator.generateGeneralReport();
      if (!response.success || !response.data) {
        throw new Error(response.error ?? "No se pudo generar el reporte");
      }
      // The Cloud Function returns the doc as a JSON string; pdfmake
      // wants a `TDocumentDefinitions` object.
      const doc: TDocumentDefinitions = JSON.parse(response.data);
      pdfMake
        .createPdf(doc, undefined, undefined, pdfMake.vfs)
        .download("general_report.pdf");
    } catch (e) {
      // Surface to the user instead of silently console.logging.
      setError(getError(e));
    }
  }

  return (
    <div className="mt-12 space-y-3">
      <CardButton
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        label="Reporte General"
        description="Generar reporte general del comportamiento del negocio"
        onClick={generateGeneralReport}
        loading={reportsGenerator.loading}
      />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Reports;
