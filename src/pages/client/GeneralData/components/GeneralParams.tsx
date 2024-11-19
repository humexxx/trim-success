import { Grid, Typography } from "@mui/material";
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
import { inputField } from "src/utils";
import { InferType } from "yup";

import { parametersScheme } from "../schema";

interface Props {
  register: UseFormRegister<InferType<typeof parametersScheme>>;
  errors: FieldErrors<InferType<typeof parametersScheme>>;
  control: Control<InferType<typeof parametersScheme>>;
  hideAutoGenerated?: boolean;
}

const GeneralParams = ({
  register,
  errors,
  control,
  hideAutoGenerated,
}: Props) => {
  const parametersFieldArray = useFieldArray({
    control,
    name: "parameters",
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color="text.secondary" variant="body1">
          Financieros
        </Typography>
      </Grid>
      {parametersFieldArray.fields.map((field, index) =>
        (hideAutoGenerated ? !field.autoCalculated : true) &&
        field.type === EDataModelParameterType.GENERAL &&
        field.subType === EDataModelParameterSubType.FINACIAL ? (
          <Grid item xs={12} key={field.id}>
            {inputField({
              valueType: field.valueType,
              ...register(`parameters.${index}.value` as const, {
                valueAsNumber: true,
              }),
              label: field.label,
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
          Operacionales
        </Typography>
      </Grid>
      {parametersFieldArray.fields.map((field, index) =>
        (hideAutoGenerated ? !field.autoCalculated : true) &&
        field.type === EDataModelParameterType.GENERAL &&
        field.subType === EDataModelParameterSubType.OPERATIVE ? (
          <Grid item xs={12} key={field.id}>
            {inputField({
              valueType: field.valueType,
              ...register(`parameters.${index}.value` as const, {
                valueAsNumber: true,
              }),
              label: field.label,
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

export default GeneralParams;
