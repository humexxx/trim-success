import { IInventoryParams } from "src/models/user";
import * as yup from "yup";
import { useInventoryParams } from "../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Alert, Grid, Typography } from "@mui/material";
import { CurrencyField } from "src/components/form";
import { LoadingButton } from "@mui/lab";

const schema = yup.object<IInventoryParams>().shape({
  manoObraCost: yup.number().required(),
  insuranceCost: yup.number().required(),
  energyCost: yup.number().required(),
  officeSupplyCost: yup.number().required(),
  officeSpaceCost: yup.number().required(),
  otherCosts: yup.number().required(),
});

const InventoryParams = () => {
  const {
    data: inventoryParams,
    loading,
    error,
    updateInventoryParams,
  } = useInventoryParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<IInventoryParams>({
    resolver: yupResolver(schema),
    defaultValues: {
      manoObraCost: 0,
      insuranceCost: 0,
      energyCost: 0,
      officeSupplyCost: 0,
      officeSpaceCost: 0,
      otherCosts: 0,
    },
  });

  function onSubmit(data: IInventoryParams) {
    updateInventoryParams(data);
  }

  useEffect(() => {
    if (inventoryParams) {
      setValue("manoObraCost", inventoryParams.manoObraCost);
      setValue("insuranceCost", inventoryParams.insuranceCost);
      setValue("energyCost", inventoryParams.energyCost);
      setValue("officeSupplyCost", inventoryParams.officeSupplyCost);
      setValue("officeSpaceCost", inventoryParams.officeSpaceCost);
      setValue("otherCosts", inventoryParams.otherCosts);
    }
  }, [setValue, inventoryParams]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid
      container
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Parámetros Inventario</Typography>
      </Grid>
      <Grid item xs={12} mb={2}>
        <Alert severity="info">
          Estos valores son utilizados para calcular el costo de inventario.
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
          {...register("energyCost")}
          label="Costo de Energía"
          error={!!errors.energyCost}
          helperText={errors.energyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("officeSupplyCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.officeSupplyCost}
          helperText={errors.officeSupplyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("officeSpaceCost")}
          label="Costo Espacio de Oficina"
          error={!!errors.officeSpaceCost}
          helperText={errors.officeSpaceCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("insuranceCost")}
          label="Costo de Seguro"
          error={!!errors.insuranceCost}
          helperText={errors.insuranceCost?.message}
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
        <LoadingButton type="submit" loading={loading} variant="contained">
          Guardar
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default InventoryParams;
