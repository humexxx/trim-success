import { Box, Typography } from "@mui/material";

type Props = {
  title?: string;
  description?: string;
};

const PageHeader = ({ title, description }: Props) => {
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
