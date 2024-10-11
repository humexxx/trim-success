import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Grid } from "@mui/material";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CardButton, PageHeader } from "src/components";
import { getError } from "src/utils";

import { useReportsGenerator } from "./hooks";


const Page = () => {
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
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del negocio"
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <CardButton
              icon={<PictureAsPdfIcon />}
              label="Reporte General"
              description={
                "Generar reporte general del comportamiento del negocio"
              }
              onClick={generateGeneralReport}
              loading={reportsGenerator.loading}
            />
          </Grid>
        </Grid>
      </PageHeader>
    </>
  );
};

export default Page;
