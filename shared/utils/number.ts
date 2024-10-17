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
