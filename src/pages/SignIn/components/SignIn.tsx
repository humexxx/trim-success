import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import { Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";

export interface SignInFormInputs {
  email: string;
  password: string;
  persist: boolean;
}

export interface SignInProps {
  handleOnSubmit: (form: SignInFormInputs) => Promise<void>;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email requerido"),
  password: yup.string().required("Contraseña requerida"),
  persist: yup.boolean().default(false),
});

export default function SignIn({ handleOnSubmit }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      persist: false,
    },
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
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
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
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
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              required
              fullWidth
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : " "}
            />
          )}
        />
        <Controller
          name="persist"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} color="primary" />}
              label="Mantener sesión iniciada"
            />
          )}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
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
          Entrar
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Olvidaste tu contraseña?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/sign-up" variant="body2">
              {"No tienes cuenta? Regístrate"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
