/**
 * Centralized Intl.NumberFormat instances used across charts, KPI
 * cards, summary stats, etc. Hoisted to module scope so they're
 * created once per session instead of per-render (Intl construction is
 * non-trivial).
 *
 * Naming: `*Fmt` is the formatter; consumers can also use the
 * `format*(value)` shortcuts for readability.
 */

/** Full USD with no decimals (e.g. `$1,234,567`). */
export const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Abbreviated USD (e.g. `$1.2M`, `$3.4K`). */
export const compactCurrencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Percentage with one decimal (e.g. `12.3%`). Input is a 0..1 ratio. */
export const percentFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Plain integer with thousand separators (e.g. `45,151`). */
export const integerFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const formatCurrency = (n: number) => currencyFmt.format(n);
export const formatCompactCurrency = (n: number) => compactCurrencyFmt.format(n);
export const formatPercent = (ratio: number) => percentFmt.format(ratio);
export const formatInteger = (n: number) => integerFmt.format(n);
