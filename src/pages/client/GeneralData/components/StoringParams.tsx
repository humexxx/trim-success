import { IStoringParams } from "src/models/user";
import { useStoringParams } from "../hooks";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Alert, Grid, Typography } from "@mui/material";
import { CurrencyField } from "src/components/form";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";

const schema = yup.object<IStoringParams>().shape({
  manoObraCost: yup.number().required(),
  alquilerCost: yup.number().required(),
  suministroOficinaCost: yup.number().required(),
  energiaCost: yup.number().required(),
  tercerizacionCost: yup.number().required(),
  otherCosts: yup.number().required(),
});

const StoringParams = () => {
  const {
    data: storingParams,
    loading,
    error,
    updateStoringParams,
  } = useStoringParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<IStoringParams>({
    resolver: yupResolver(schema),
    defaultValues: {
      manoObraCost: 0,
      alquilerCost: 0,
      suministroOficinaCost: 0,
      energiaCost: 0,
      tercerizacionCost: 0,
      otherCosts: 0,
    },
  });

  function onSubmit(data: IStoringParams) {
    updateStoringParams(data);
  }

  useEffect(() => {
    if (storingParams) {
      setValue("manoObraCost", storingParams.manoObraCost);
      setValue("alquilerCost", storingParams.alquilerCost);
      setValue("suministroOficinaCost", storingParams.suministroOficinaCost);
      setValue("energiaCost", storingParams.energiaCost);
      setValue("tercerizacionCost", storingParams.tercerizacionCost);
      setValue("otherCosts", storingParams.otherCosts);
    }
  }, [setValue, storingParams]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Parámetros Almacenaje</Typography>
      </Grid>
      <Grid item xs={12} mb={2}>
        <Alert severity="info">
          Estos valores son utilizados para calcular el costo de almacenamiento.
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("manoObraCost")}
          label="Costo Mano de Obra"
          error={!!errors.manoObraCost}
          helperText={errors.manoObraCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("alquilerCost")}
          label="Costo Alquiler"
          error={!!errors.alquilerCost}
          helperText={errors.alquilerCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("suministroOficinaCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.suministroOficinaCost}
          helperText={errors.suministroOficinaCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("energiaCost")}
          label="Costo Energía"
          error={!!errors.energiaCost}
          helperText={errors.energiaCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("tercerizacionCost")}
          label="Costo Tercerización"
          error={!!errors.tercerizacionCost}
          helperText={errors.tercerizacionCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("otherCosts")}
          label="Otros Costos"
          error={!!errors.otherCosts}
          helperText={errors.otherCosts?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} mt={2} textAlign="right">
        <LoadingButton type="submit" variant="contained" loading={loading}>
          Guardar
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default StoringParams;
