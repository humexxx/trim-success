import { ReactNode } from "react";

import { Box } from "@mui/material";

const PageContent = ({ children }: { children: ReactNode }) => {
  return (
    <Box component={"section"} sx={{ mt: 2 }}>
      {children}
    </Box>
  );
};

export default PageContent;
