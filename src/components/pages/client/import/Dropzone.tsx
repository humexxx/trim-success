import { Box } from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";
import * as XLSX from "xlsx";

interface DropzoneProps {
  onJsonDataChange: (data: any[][]) => void;
}

const Dropzone = ({ onJsonDataChange }: DropzoneProps) => {
  function handleOnFileChange(files: File[]) {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: true,
          });

          if (jsonData.length > 0) {
            onJsonDataChange(jsonData);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <Box
      className="dropzone"
      sx={{
        "& .dropzone-text": { color: "text.primary" },
        "& .MuiTypography-subtitle1": {
          color: "text.primary",
          mt: 4,
          mb: 1,
          display: "block",
        },
      }}
    >
      <DropzoneArea
        classes={{
          text: "dropzone-text",
        }}
        filesLimit={1}
        acceptedFiles={[".xlsx", ".xls"]}
        fileObjects={[".xlsx", ".xls"]}
        onChange={handleOnFileChange}
        showPreviewsInDropzone={false}
        showPreviews
        useChipsForPreview
        dropzoneText="Arrastra un archivo Excel aquí o haz clic para seleccionar uno"
        previewText="Vista previa"
      />
    </Box>
  );
};

export default Dropzone;
