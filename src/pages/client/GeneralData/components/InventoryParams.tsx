import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
import { CurrencyField, PercentageField } from "src/components/form";
import { IParamsData } from "src/models";

interface Props {
  register: UseFormRegister<Omit<IParamsData, "drivers" | "categories">>;
  errors: FieldErrors<Omit<IParamsData, "drivers" | "categories">>;
  control: Control<Omit<IParamsData, "drivers" | "categories">>;
}

const InventoryParams = ({ register, errors, control }: Props) => {
  const costsFieldArray = useFieldArray({
    control,
    name: "inventoryParams.costs",
  });

  const investmentsFieldArray = useFieldArray({
    control,
    name: "inventoryParams.investments",
  });

  const inputField = ({ type, ...props }: any) => {
    switch (type) {
      case "currency":
        return <CurrencyField {...props} />;
      case "percentage":
        return <PercentageField {...props} />;
      default:
        return (
          <TextField
            type="number"
            InputLabelProps={{ shrink: true }}
            {...props}
          />
        );
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Costos
        </Typography>
      </Grid>
      {costsFieldArray.fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          {inputField({
            type: field.type,
            ...register(`inventoryParams.costs.${index}.value` as const, {
              valueAsNumber: true,
            }),
            label: field.label,
            error: !!errors.inventoryParams?.costs?.[index]?.value,
            helperText: errors.inventoryParams?.costs?.[index]?.value?.message,

            fullWidth: true,
          })}
        </Grid>
      ))}
      <Grid item xs={12} mt={2}>
        <Typography color="text.secondary" variant="body1">
          Inversiones
        </Typography>
      </Grid>
      {investmentsFieldArray.fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          {inputField({
            type: field.type,
            ...register(`inventoryParams.investments.${index}.value` as const, {
              valueAsNumber: true,
            }),
            label: field.label,
            error: !!errors.inventoryParams?.investments?.[index]?.value,
            helperText:
              errors.inventoryParams?.investments?.[index]?.value?.message,

            fullWidth: true,
          })}
        </Grid>
      ))}
    </Grid>
  );
};

export default InventoryParams;
