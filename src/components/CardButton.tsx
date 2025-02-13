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
import { Link } from "react-router-dom";

type BaseProps = {
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  error?: string | null;
  elevation?: number;
  disabled?: boolean;
};

type LinkProps = BaseProps & {
  isLink: true;
  to: string;
};

type ButtonProps = BaseProps & {
  isLink?: false;
  to?: never;
};

type Props = LinkProps | ButtonProps;

const CardButton = ({
  icon,
  description,
  label,
  onClick,
  loading,
  error,
  elevation = 1,
  disabled,
  isLink,
  to,
}: Props) => {
  const Content = (
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
      disabled={loading || disabled}
      elevation={elevation}
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
                ...(loading || disabled
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
          color={loading || disabled ? "text.disabled" : "text.secondary"}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return isLink && !disabled ? (
    <Link to={to} style={{ textDecoration: "none" }}>
      {Content}
    </Link>
  ) : (
    Content
  );
};

export default CardButton;
