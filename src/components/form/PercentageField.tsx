import { forwardRef, InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const PercentageField = forwardRef<HTMLInputElement, Props>(
  function PercentageField(
    { label, error, helperText, fullWidth, className, id, ...props },
    ref
  ) {
    const inputId = id ?? props.name;
    return (
      <div className={cn(fullWidth && "w-full", "space-y-1.5")}>
        {label && (
          <Label
            htmlFor={inputId}
            className={error ? "text-destructive" : undefined}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
          <Input
            {...props}
            id={inputId}
            ref={ref}
            type="number"
            step="0.01"
            className={cn("pl-7", error && "border-destructive", className)}
            onFocus={(e) => e.target.select()}
          />
        </div>
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
  }
);

export default PercentageField;
