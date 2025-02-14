import { Box } from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";

interface Props {
  handleNext: (file: File) => void;
}

const Dropzone = ({ handleNext }: Props) => {
  function handleOnFileChange(files: File[]) {
    if (files.length > 0) {
      handleNext(files[0]);
    }
  }

  return (
    <Box
      maxWidth={600}
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
        alertSnackbarProps={{
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }}
        onDropRejected={console.error}
        maxFileSize={100000000}
        showAlerts={["error"]}
      />
    </Box>
  );
};

export default Dropzone;
