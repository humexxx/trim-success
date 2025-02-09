import React from "react";

import { Box, Typography } from "@mui/material";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME } from "src/lib/consts";

type Props = {
  title?: string;
  description?: string;
};

const PageHeader = ({ title, description }: Props) => {
  useDocumentMetadata(`${title} | ${APP_NAME}`);
  return (
    <Box component={"header"} pt={4}>
      {Boolean(title) && (
        <Typography
          color="text.primary"
          variant="h4"
          component="h1"
          fontWeight={600}
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
