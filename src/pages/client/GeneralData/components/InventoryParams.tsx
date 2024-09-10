import { IParams } from "src/models/user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid } from "@mui/material";
import { CurrencyField } from "src/components/form";

interface Props {
  register: UseFormRegister<IParams>;
  errors: FieldErrors<IParams>;
}

const InventoryParams = ({ register, errors }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.manoObraCost")}
          label="Costo Mano de Obra"
          error={!!errors.inventoryParams?.manoObraCost}
          helperText={errors.inventoryParams?.manoObraCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.energyCost")}
          label="Costo de Energía"
          error={!!errors.inventoryParams?.energyCost}
          helperText={errors.inventoryParams?.energyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.officeSupplyCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.inventoryParams?.officeSupplyCost}
          helperText={errors.inventoryParams?.officeSupplyCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.officeSpaceCost")}
          label="Costo Espacio de Oficina"
          error={!!errors.inventoryParams?.officeSpaceCost}
          helperText={errors.inventoryParams?.officeSpaceCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.insuranceCost")}
          label="Costo de Seguro"
          error={!!errors.inventoryParams?.insuranceCost}
          helperText={errors.inventoryParams?.insuranceCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("inventoryParams.otherCosts")}
          label="Otros Costos"
          error={!!errors.inventoryParams?.otherCosts}
          helperText={errors.inventoryParams?.otherCosts?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default InventoryParams;
