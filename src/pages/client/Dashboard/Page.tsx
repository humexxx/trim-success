import { useEffect } from "react";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Grid } from "@mui/material";
import { STORAGE_PATH } from "@shared/consts";
import { IDataModel } from "@shared/models";
import { listAll, getMetadata, getDownloadURL, ref } from "firebase/storage";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CardButton, PageHeader } from "src/components";
import { useAuth } from "src/context/auth";
import { storage } from "src/firebase";
import { getError } from "src/utils";

import { useReportsGenerator } from "./hooks";

const Page = () => {
  const reportsGenerator = useReportsGenerator();
  const { isAdmin, customUser, currentUser } = useAuth();

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

  const fetchJsonFile = async () => {
    try {
      const folderRef = ref(
        storage,
        `${STORAGE_PATH}/${isAdmin ? customUser?.uid : currentUser?.uid}/`
      );
      // List all files in the folder
      const result = await listAll(folderRef);

      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);

        // Check if the MIME type is 'application/json'
        if (metadata.contentType === "application/json") {
          const downloadURL = await getDownloadURL(itemRef);

          // Fetch the JSON content from the download URL
          const response = await fetch(downloadURL);
          const jsonData = (await response.json()) as IDataModel;

          console.log(jsonData);
          break; // Exit the loop once we find the JSON file
        }
      }
    } catch (error) {
      console.error("Error fetching JSON file:", error);
    }
  };

  useEffect(() => {
    fetchJsonFile();
  }, []);

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
