import { FileText } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import { CardButton } from "src/components";
import { getError } from "src/utils";

import { useReportsGenerator } from "../hooks";

const Reports = () => {
  const reportsGenerator = useReportsGenerator();

  async function generateGeneralReport() {
    try {
      const { data: response } = await reportsGenerator.generateGeneralReport();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = JSON.parse((response as any).data);
      pdfMake
        .createPdf(data, undefined, undefined, pdfMake.vfs)
        .download("general_report.pdf");
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getError(e as any);
    }
  }

  return (
    <div className="mt-12">
      <CardButton
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        label="Reporte General"
        description="Generar reporte general del comportamiento del negocio"
        onClick={generateGeneralReport}
        loading={reportsGenerator.loading}
      />
    </div>
  );
};

export default Reports;
