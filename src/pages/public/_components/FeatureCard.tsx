import React from "react";

import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";

export interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  link,
}: Omit<IFeature, "id">) => {
  return (
    <Link
      href={link}
      aria-label={`Ir a ${title}`}
      sx={{ textDecoration: "none" }}
    >
      <Card
        elevation={0}
        sx={{ p: 2, bgcolor: "background.paper", height: "100%" }}
      >
        <Grid container spacing={2} className="h-full">
          <Grid size={8}>
            <Stack
              spacing={2}
              justifyContent={"space-between"}
              className="h-full"
            >
              <Stack spacing={2}>
                <Typography variant="body1" component={"h4"}>
                  {title}
                </Typography>
                <Typography variant="caption" component={"p"}>
                  {description}
                </Typography>
              </Stack>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#1A1A1A", mt: 2 }}
                >
                  Ver detalles
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};

export default FeatureCard;
