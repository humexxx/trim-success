import { Grid, TextField, Typography } from "@mui/material";
import {
  EDataModelParameterType,
  EDataModelParameterSubType,
} from "@shared/enums";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { CurrencyField, PercentageField } from "src/components/form";
import { InferType } from "yup";

import { parametersScheme } from "../schema";

interface Props {
  register: UseFormRegister<InferType<typeof parametersScheme>>;
  errors: FieldErrors<InferType<typeof parametersScheme>>;
  control: Control<InferType<typeof parametersScheme>>;
}

const StoringParams = ({ register, errors, control }: Props) => {
  const parametersFieldArray = useFieldArray({
    control,
    name: "parameters",
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
      {parametersFieldArray.fields.map((field, index) =>
        field.type === EDataModelParameterType.STORING &&
        field.subType === EDataModelParameterSubType.COSTS ? (
          <Grid item xs={12} key={field.id}>
            {inputField({
              type: field.type,
              ...register(`parameters.${index}.value` as const, {
                valueAsNumber: true,
              }),
              label: field.name,
              error: !!errors.parameters?.[index]?.value,
              helperText: errors.parameters?.[index]?.value?.message,
              fullWidth: true,
              disabled: field.autoCalculated,
            })}
          </Grid>
        ) : null
      )}
      <Grid item xs={12} mt={2}>
        <Typography color="text.secondary" variant="body1">
          Inversiones
        </Typography>
      </Grid>
      {parametersFieldArray.fields.map((field, index) =>
        field.type === EDataModelParameterType.STORING &&
        field.subType === EDataModelParameterSubType.INVESTMENTS ? (
          <Grid item xs={12} key={field.id}>
            {inputField({
              type: field.type,
              ...register(`parameters.${index}.value` as const, {
                valueAsNumber: true,
              }),
              label: field.name,
              error: !!errors.parameters?.[index]?.value,
              helperText: errors.parameters?.[index]?.value?.message,
              fullWidth: true,
              disabled: field.autoCalculated,
            })}
          </Grid>
        ) : null
      )}
    </Grid>
  );
};

export default StoringParams;
