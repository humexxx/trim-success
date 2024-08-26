import { Box } from "@mui/material";
import { PageHeader } from "src/components";
import { useDocumentMetadata } from "src/hooks";

const Page = () => {
  useDocumentMetadata("Scorecard - Trim Success");
  return (
    <>
      <PageHeader title="Scorecard" description="Página de Scorecard" />
      <Box>some info</Box>
    </>
  );
};

export default Page;
