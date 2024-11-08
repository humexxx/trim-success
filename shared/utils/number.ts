import { EValueType } from "@shared/enums";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatPercentage(value?: number): string {
  if (!value) return "";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);
}

export function roundToDecimals(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

export function formatValue(value: number, valueType: EValueType): string {
  switch (valueType) {
    case EValueType.AMOUNT:
      return formatCurrency(value);
    case EValueType.PERCENTAGE:
      return formatPercentage(value);
    default:
      return value.toString();
  }
}
