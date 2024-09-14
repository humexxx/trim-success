import { IDataParams } from "src/models/user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Grid, Typography } from "@mui/material";
import { CurrencyField } from "src/components/form";

interface Props {
  register: UseFormRegister<IDataParams>;
  errors: FieldErrors<IDataParams>;
}

const StoringParams = ({ register, errors }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Costos
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.manoObraCost")}
          label="Costo Mano de Obra"
          error={!!errors.storingParams?.costs.manoObraCost}
          helperText={errors.storingParams?.costs.manoObraCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.alquilerCost")}
          label="Costo Alquiler"
          error={!!errors.storingParams?.costs.alquilerCost}
          helperText={errors.storingParams?.costs.alquilerCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.suministroOficinaCost")}
          label="Costo Suministro de Oficina"
          error={!!errors.storingParams?.costs.suministroOficinaCost}
          helperText={
            errors.storingParams?.costs.suministroOficinaCost?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.energiaCost")}
          label="Costo Energía"
          error={!!errors.storingParams?.costs.energiaCost}
          helperText={errors.storingParams?.costs.energiaCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.tercerizacionCost")}
          label="Costo Tercerización"
          error={!!errors.storingParams?.costs.tercerizacionCost}
          helperText={errors.storingParams?.costs.tercerizacionCost?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.costs.otherCosts")}
          label="Otros Costos"
          error={!!errors.storingParams?.costs.otherCosts}
          helperText={errors.storingParams?.costs.otherCosts?.message}
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
          {...register("storingParams.investments.terrenoEdificio")}
          label="Inversión Terreno Edificio"
          error={!!errors.storingParams?.investments.terrenoEdificio}
          helperText={
            errors.storingParams?.investments.terrenoEdificio?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.investments.manejoMateriales")}
          label="Inversión Manejo de Materiales"
          error={!!errors.storingParams?.investments.manejoMateriales}
          helperText={
            errors.storingParams?.investments.manejoMateriales?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.investments.almacenajeMateriales")}
          label="Inversión Almacenaje de Materiales"
          error={!!errors.storingParams?.investments.almacenajeMateriales}
          helperText={
            errors.storingParams?.investments.almacenajeMateriales?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.investments.administracionAlmacen")}
          label="Inversión Administración de Almacen"
          error={!!errors.storingParams?.investments.administracionAlmacen}
          helperText={
            errors.storingParams?.investments.administracionAlmacen?.message
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <CurrencyField
          {...register("storingParams.investments.otrasInversiones")}
          label="Otras Inversiones"
          error={!!errors.storingParams?.investments.otrasInversiones}
          helperText={
            errors.storingParams?.investments.otrasInversiones?.message
          }
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default StoringParams;
