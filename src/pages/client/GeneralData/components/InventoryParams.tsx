import { IDataParams } from "src/models/user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid, Typography } from "@mui/material";
import { CurrencyField } from "src/components/form";

interface Props {
  register: UseFormRegister<IDataParams>;
  errors: FieldErrors<IDataParams>;
}

const InventoryParams = ({ register, errors }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Costos
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.manoObraCost")}
          label="Costo Mano de Obra"
          error={!!errors.inventoryParams?.costs.manoObraCost}
          helperText={errors.inventoryParams?.costs.manoObraCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.energyCost")}
          label="Costo de Energía"
          error={!!errors.inventoryParams?.costs.energyCost}
          helperText={errors.inventoryParams?.costs.energyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.officeSupplyCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.inventoryParams?.costs.officeSupplyCost}
          helperText={errors.inventoryParams?.costs.officeSupplyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.officeSpaceCost")}
          label="Costo Espacio de Oficina"
          error={!!errors.inventoryParams?.costs.officeSpaceCost}
          helperText={errors.inventoryParams?.costs.officeSpaceCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.insuranceCost")}
          label="Costo de Seguro"
          error={!!errors.inventoryParams?.costs.insuranceCost}
          helperText={errors.inventoryParams?.costs.insuranceCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.costs.otherCosts")}
          label="Otros Costos"
          error={!!errors.inventoryParams?.costs.otherCosts}
          helperText={errors.inventoryParams?.costs.otherCosts?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <Typography color="text.secondary" variant="body1">
          Inversiones
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.investments.hardwareInvestment")}
          label="Inversión en Hardware"
          error={!!errors.inventoryParams?.investments.hardwareInvestment}
          helperText={
            errors.inventoryParams?.investments.hardwareInvestment?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.investments.inventoryInvestment")}
          label="Inversión en Inventario"
          error={!!errors.inventoryParams?.investments.inventoryInvestment}
          helperText={
            errors.inventoryParams?.investments.inventoryInvestment?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register(
            "inventoryParams.investments.managementSystemInvestment"
          )}
          label="Inversión en Sistema de Gestión"
          error={
            !!errors.inventoryParams?.investments.managementSystemInvestment
          }
          helperText={
            errors.inventoryParams?.investments.managementSystemInvestment
              ?.message
          }
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default InventoryParams;
