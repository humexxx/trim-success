import { IDataParams } from "src/models/user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
import { CurrencyField, PercentageField } from "src/components/form";

interface Props {
  register: UseFormRegister<IDataParams>;
  errors: FieldErrors<IDataParams>;
  hideSum?: boolean;
}

const GeneralParams = ({ register, errors, hideSum = false }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Financieros
        </Typography>
      </Grid>
      {!hideSum && (
        <Grid item xs={12}>
          <CurrencyField
            {...register("generalParams.financial.sales")}
            label="Ventas"
            error={!!errors.generalParams?.financial?.sales}
            helperText={errors.generalParams?.financial?.sales?.message}
            fullWidth
            disabled
            size="small"
          />
        </Grid>
      )}
      {!hideSum && (
        <Grid item xs={12}>
          <CurrencyField
            {...register("generalParams.financial.salesCost")}
            label="Ventas al Costo"
            error={!!errors.generalParams?.financial?.salesCost}
            helperText={errors.generalParams?.financial?.salesCost?.message}
            fullWidth
            disabled
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <PercentageField
          {...register("generalParams.financial.inventoryAnnualCost")}
          label="Costos Financeiro anual del Inventario %"
          error={!!errors.generalParams?.financial?.inventoryAnnualCost}
          helperText={
            errors.generalParams?.financial?.inventoryAnnualCost?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <PercentageField
          {...register("generalParams.financial.companyCapitalCost")}
          label="Costo de Capital de la Empresa %"
          error={!!errors.generalParams?.financial?.companyCapitalCost}
          helperText={
            errors.generalParams?.financial?.companyCapitalCost?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <PercentageField
          {...register("generalParams.financial.technologyCapitalCost")}
          label="Costo de Capital de  Tecnologia Infor %"
          error={!!errors.generalParams?.financial?.technologyCapitalCost}
          helperText={
            errors.generalParams?.financial?.technologyCapitalCost?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <Typography color="text.secondary" variant="body1">
          Operacionales
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register("generalParams.operational.annualWorkingHours")}
          label="Número de horas laborales anual FTE"
          error={!!errors.generalParams?.operational?.annualWorkingHours}
          helperText={
            errors.generalParams?.operational?.annualWorkingHours?.message
          }
          fullWidth
          type="number"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
};

export default GeneralParams;
