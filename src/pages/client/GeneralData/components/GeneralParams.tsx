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

const GeneralParams = ({ register, errors, control }: Props) => {
  const financialFieldArray = useFieldArray({
    control,
    name: "generalParams.financial",
  });

  const operationalFieldArray = useFieldArray({
    control,
    name: "generalParams.operational",
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
          Financieros
        </Typography>
      </Grid>
      {financialFieldArray.fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          {inputField({
            type: field.type,
            ...register(`generalParams.financial.${index}.value` as const, {
              valueAsNumber: true,
            }),
            label: field.label,
            error: !!errors.generalParams?.financial?.[index]?.value,
            helperText:
              errors.generalParams?.financial?.[index]?.value?.message,

            fullWidth: true,
            disabled: index < 2,
          })}
        </Grid>
      ))}
      <Grid item xs={12} mt={2}>
        <Typography color="text.secondary" variant="body1">
          Operacionales
        </Typography>
      </Grid>
      {operationalFieldArray.fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          {inputField({
            type: field.type,
            ...register(`generalParams.operational.${index}.value` as const, {
              valueAsNumber: true,
            }),
            label: field.label,
            error: !!errors.generalParams?.financial?.[index]?.value,
            helperText:
              errors.generalParams?.financial?.[index]?.value?.message,

            fullWidth: true,
          })}
        </Grid>
      ))}
    </Grid>
  );
};

export default GeneralParams;
