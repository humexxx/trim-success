import { EValueType } from "@shared/enums";
import { CurrencyField, PercentageField } from "src/components/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  valueType: EValueType;
  label?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export const inputField = ({
  valueType,
  label,
  error,
  helperText,
  fullWidth,
  ...props
}: InputFieldProps) => {
  switch (valueType) {
    case EValueType.AMOUNT:
      return (
        <CurrencyField
          label={label}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          {...props}
        />
      );
    case EValueType.PERCENTAGE:
      return (
        <PercentageField
          label={label}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          {...props}
        />
      );
    default:
      return (
        <div className={fullWidth ? "w-full space-y-1.5" : "space-y-1.5"}>
          {label && (
            <Label
              htmlFor={props.name}
              className={error ? "text-destructive" : undefined}
            >
              {label}
            </Label>
          )}
          <Input id={props.name} type="number" {...props} />
          {helperText && (
            <p
              className={
                error ? "text-xs text-destructive" : "text-xs text-muted-foreground"
              }
            >
              {helperText}
            </p>
          )}
        </div>
      );
  }
};
