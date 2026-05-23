import { forwardRef, InputHTMLAttributes } from "react";

import { IMaskInput } from "react-imask";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  onChange?: (event: { target: { name: string; value: string } }) => void;
}

const PhoneField = forwardRef<HTMLInputElement, Props>(function PhoneField(
  { label, error, helperText, fullWidth, className, id, name, onChange, value, ...props },
  ref
) {
  const inputId = id ?? name;
  return (
    <div className={cn(fullWidth && "w-full", "space-y-1.5")}>
      {label && (
        <Label htmlFor={inputId} className={error ? "text-destructive" : undefined}>
          {label}
        </Label>
      )}
      <IMaskInput
        {...props}
        name={name}
        value={value as string | undefined}
        mask="0000-0000"
        overwrite
        inputRef={ref}
        onAccept={(val: string) =>
          onChange?.({ target: { name: name ?? "", value: val } })
        }
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive",
          className
        )}
        id={inputId}
      />
      {helperText && (
        <p
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default PhoneField;
