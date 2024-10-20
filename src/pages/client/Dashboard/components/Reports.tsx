import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CardButton } from "src/components";
import { getError } from "src/utils";

import { useReportsGenerator } from "../hooks";

const Reports = () => {
  const reportsGenerator = useReportsGenerator();

  async function generateGeneralReport() {
    try {
      const { data: response } = await reportsGenerator.generateGeneralReport();
      const data = JSON.parse((response as any).data);
      pdfMake
        .createPdf(data, undefined, undefined, pdfFonts.pdfMake.vfs)
        .download("general_report.pdf");
    } catch (e: any) {
      getError(e);
    }
  }

  return (
    <>
      <CardButton
        icon={<PictureAsPdfIcon />}
        label="Reporte General"
        description={"Generar reporte general del comportamiento del negocio"}
        onClick={generateGeneralReport}
        loading={reportsGenerator.loading}
      />
    </>
  );
};

export default Reports;
