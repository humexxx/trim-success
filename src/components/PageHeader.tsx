import React from "react";
import { Box, Typography } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";

type Props = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
};

const PageHeader = ({ children, title, description }: Props) => {
  useDocumentMetadata(`${title} | Trim Success`);
  return (
    <Box mb={4}>
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
      {children}
    </Box>
  );
};

export default PageHeader;
