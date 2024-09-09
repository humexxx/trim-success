import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "@mui/material";

export interface ForgotPasswordFormInputs {
  email: string;
}

export interface ForgotPasswordProps {
  handleOnSubmit: (form: ForgotPasswordFormInputs) => Promise<void>;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email requerido"),
});

export default function ForgotPassword({
  handleOnSubmit,
}: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await handleOnSubmit(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2, width: "100%" }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              required
              fullWidth
              label="Email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : " "}
            />
          )}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Typography>
        )}
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isLoading}
        >
          Enviar email de recuperación
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/sign-in" variant="body2">
              Regresar al inicio de sesión
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/sign-up" variant="body2">
              No tienes una cuenta? Regístrate
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
