import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "@mui/material";
import { PhoneField } from "src/components/form";
import SaveIcon from "@mui/icons-material/Save";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "src/firebase";
import { useAuth } from "src/context/auth";
import { useDocumentMetadata } from "src/hooks";

const schema = yup.object().shape({
  name: yup.string().required("Nombre requerido"),
  phone: yup.string().required("Teléfono requerido"),
  description: yup.string().required("Descripción requerida"),
});

interface FormInputs {
  name: string;
  phone: string;
  description: string;
}

export default function UserPage() {
  useDocumentMetadata("Usuario - Trim Success");
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    try {
      const docRef = doc(firestore, "users", user.currentUser!.uid);
      await setDoc(docRef, data, { merge: true });
      alert("Datos guardados correctamente");
    } catch (error) {
      console.error("Error guardando los datos: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const docRef = doc(firestore, "users", user.currentUser!.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FormInputs;

        setValue("name", data.name);
        setValue("phone", data.phone);
        setValue("description", data.description);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [setValue, user.currentUser]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography ml={1} component="h1" variant="h5">
          Información de Usuario
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ my: 4 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              fullWidth
              label="Nombre"
              autoFocus
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : " "}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneField
              {...field}
              label="Teléfono"
              margin="dense"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone ? errors.phone.message : " "}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              fullWidth
              label="Descripción"
              multiline
              rows={2}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : " "}
              disabled={isLoading}
            />
          )}
        />
        <Box display="flex" justifyContent="flex-end">
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={isLoading}
            startIcon={<SaveIcon />}
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
