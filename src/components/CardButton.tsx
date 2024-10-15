import { ReactNode } from "react";

import {
  Card,
  CardContent,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

type Props = {
  label: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  loading?: boolean;
  error?: string | null;
};

const CardButton = ({
  icon,
  description,
  label,
  onClick,
  loading,
  error,
}: Props) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        position: "relative",
        width: "100%",
        alignItems: "flex-start",
      }}
      component={Button}
      onClick={onClick}
      disabled={loading}
    >
      {loading && (
        <CircularProgress
          sx={{ position: "absolute", top: 16, right: 16 }}
          size={25}
        />
      )}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <Typography
            variant="caption"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {error}
          </Typography>
        </Box>
      )}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          textTransform: "none",
        }}
      >
        <Box>
          <Paper
            sx={{
              display: "inline-block",
              p: 1,
              mb: 1,
              border: "1px solid rgba(205, 209, 228, 0.2)",
              "& svg": {
                ...(loading
                  ? {
                      color: "text.disabled",
                    }
                  : {}),
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
          </Paper>
          <Typography variant="body1" component="h3" my={2}>
            <strong>{label}</strong>
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color={loading ? "text.disabled" : "text.secondary"}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardButton;
