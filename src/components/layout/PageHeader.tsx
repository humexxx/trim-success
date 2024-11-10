import React from "react";

import { Box, Typography } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";

type Props = {
  title?: string;
  description?: string;
};

const PageHeader = ({ title, description }: Props) => {
  useDocumentMetadata(`${title} | Trim Success`);
  return (
    <Box component={"header"}>
      {Boolean(title) && (
        <Typography
          color="text.primary"
          variant="h6"
          component="h2"
          gutterBottom
        >
          <strong>{title}</strong>
        </Typography>
      )}
      {Boolean(description) && (
        <Typography color="text.secondary" variant="body1">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
