import { Container } from "@mui/material";
import { ReactNode } from "react";

const PageContent = ({ children }: { children: ReactNode }) => {
  return (
    <Container component={"section"} maxWidth="xl" sx={{ mt: 2 }}>
      {children}
    </Container>
  );
};

export default PageContent;
