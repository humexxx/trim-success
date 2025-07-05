import { PropsWithChildren } from "react";

import { Box } from "@mui/material";

const Section = ({ children }: PropsWithChildren) => {
  return (
    <Box component={"section"} py={8}>
      {children}
    </Box>
  );
};

export default Section;
