import { Alert, Box, Snackbar } from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";
import { getJsonDataFromFile } from "src/utils";
import { useCube } from "src/context/cube";

interface Props {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const Dropzone = ({ setLoading, loading }: Props) => {
  const cube = useCube();

  function handleOnFileChange(files: File[]) {
    if (files.length > 0) {
      setLoading(true);
      setTimeout(() => {
        const file = files[0];
        getJsonDataFromFile((jsonData: any[][]) => {
          cube.setFileResolution({
            jsonData,
            file,
          });
          setLoading(false);
        }, file);
      }, 1000);
    }
  }

  return (
    <>
      <Snackbar
        open={loading}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
          Please wait while parsing the file...
        </Alert>
      </Snackbar>
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
          alertSnackbarProps={{
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }}
          onDropRejected={console.error}
          maxFileSize={100000000}
          showAlerts={["error"]}
        />
      </Box>
    </>
  );
};

export default Dropzone;
