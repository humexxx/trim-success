import { IParams } from "src/models/user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid } from "@mui/material";
import { CurrencyField } from "src/components/form";

interface Props {
  register: UseFormRegister<IParams>;
  errors: FieldErrors<IParams>;
}

const StoringParams = ({ register, errors }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.manoObraCost")}
          label="Costo Mano de Obra"
          error={!!errors.storingParams?.manoObraCost}
          helperText={errors.storingParams?.manoObraCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.alquilerCost")}
          label="Costo Alquiler"
          error={!!errors.storingParams?.alquilerCost}
          helperText={errors.storingParams?.alquilerCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.suministroOficinaCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.storingParams?.suministroOficinaCost}
          helperText={errors.storingParams?.suministroOficinaCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.energiaCost")}
          label="Costo Energía"
          error={!!errors.storingParams?.energiaCost}
          helperText={errors.storingParams?.energiaCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.tercerizacionCost")}
          label="Costo Tercerización"
          error={!!errors.storingParams?.tercerizacionCost}
          helperText={errors.storingParams?.tercerizacionCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.otherCosts")}
          label="Otros Costos"
          error={!!errors.storingParams?.otherCosts}
          helperText={errors.storingParams?.otherCosts?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default StoringParams;
