import { TextField } from "@mui/material";
import { EValueType } from "@shared/enums";
import { CurrencyField, PercentageField } from "src/components/form";

export const inputField = ({
  valueType,
  ...props
}: { valueType: EValueType } & any) => {
  switch (valueType) {
    case EValueType.AMOUNT:
      return <CurrencyField {...props} />;
    case EValueType.PERCENTAGE:
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
