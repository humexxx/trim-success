import { IGeneralParams } from "src/models/user";
import * as yup from "yup";
import { useGeneralParams } from "../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Alert, Grid, TextField, Typography } from "@mui/material";
import { CurrencyField, PercentageField } from "src/components/form";
import { LoadingButton } from "@mui/lab";

const schema = yup.object<IGeneralParams>().shape({
  financial: yup.object({
    sales: yup.number().required(),
    salesCost: yup.number().required(),
    inventoryAnnualCost: yup.number().required(),
    companyCapitalCost: yup.number().required(),
    technologyCapitalCost: yup.number().required(),
  }),
  operational: yup.object({
    annualWorkingHours: yup.number().required(),
  }),
});

const GeneralParams = () => {
  const {
    data: generalParams,
    loading,
    error,
    updateGeneralParams,
  } = useGeneralParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<IGeneralParams>({
    resolver: yupResolver(schema),
    defaultValues: {
      financial: {
        sales: 0,
        salesCost: 0,
        inventoryAnnualCost: 0,
        companyCapitalCost: 0,
        technologyCapitalCost: 0,
      },
      operational: {
        annualWorkingHours: 0,
      },
    },
  });

  function onSubmit(data: IGeneralParams) {
    updateGeneralParams(data);
  }

  useEffect(() => {
    if (generalParams) {
      setValue("financial.sales", generalParams.financial.sales);
      setValue("financial.salesCost", generalParams.financial.salesCost);
      setValue(
        "financial.inventoryAnnualCost",
        generalParams.financial.inventoryAnnualCost
      );
      setValue(
        "financial.companyCapitalCost",
        generalParams.financial.companyCapitalCost
      );
      setValue(
        "financial.technologyCapitalCost",
        generalParams.financial.technologyCapitalCost
      );
      setValue(
        "operational.annualWorkingHours",
        generalParams.operational.annualWorkingHours
      );
    }
  }, [setValue, generalParams]);

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
        <Typography color="text.primary" variant="h6">
          Parámetros Generales
        </Typography>
      </Grid>
      <Grid item xs={12} mb={2}>
        <Alert severity="info">
          Estos son los parámetros generales de la empresa.
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Financieros
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("financial.sales")}
          label="Ventas"
          error={!!errors.financial?.sales}
          helperText={errors.financial?.sales?.message}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("financial.salesCost")}
          label="Ventas al Costo"
          error={!!errors.financial?.salesCost}
          helperText={errors.financial?.salesCost?.message}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <PercentageField
          {...register("financial.inventoryAnnualCost")}
          label="Costos Financeiro anual del Inventario %"
          error={!!errors.financial?.inventoryAnnualCost}
          helperText={errors.financial?.inventoryAnnualCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <PercentageField
          {...register("financial.companyCapitalCost")}
          label="Costo de Capital de la Empresa %"
          error={!!errors.financial?.companyCapitalCost}
          helperText={errors.financial?.companyCapitalCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <PercentageField
          {...register("financial.technologyCapitalCost")}
          label="Costo de Capital de  Tecnologia Infor %"
          error={!!errors.financial?.technologyCapitalCost}
          helperText={errors.financial?.technologyCapitalCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Operacionales
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register("operational.annualWorkingHours")}
          label="Número de horas laborales anual FTE"
          error={!!errors.operational?.annualWorkingHours}
          helperText={errors.operational?.annualWorkingHours?.message}
          fullWidth
          type="number"
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

export default GeneralParams;
