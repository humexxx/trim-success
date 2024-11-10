import { EAmountType, EValueType } from "@shared/enums";

export function formatAmount(
  value: number,
  formatType: EAmountType = EAmountType.DEFAULT
): string {
  if (formatType === EAmountType.MILLIS) {
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(value);
  }

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
      return formatAmount(value);
    case EValueType.PERCENTAGE:
      return formatPercentage(value);
    default:
      return value.toString();
  }
}
