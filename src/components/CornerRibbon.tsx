import { cn } from "@/lib/utils";

interface Props {
  /** Short label rendered inside the ribbon (e.g. BETA, NUEVO, PRO). */
  label: string;
  /** Color preset. Falls back to amber. */
  tone?: "amber" | "emerald" | "blue" | "rose";
}

const TONES: Record<
  NonNullable<Props["tone"]>,
  { bar: string; foldBorder: string }
> = {
  amber: {
    bar: "bg-amber-400 text-amber-950",
    foldBorder: "border-t-amber-700",
  },
  emerald: {
    bar: "bg-emerald-500 text-emerald-50",
    foldBorder: "border-t-emerald-800",
  },
  blue: {
    bar: "bg-blue-500 text-blue-50",
    foldBorder: "border-t-blue-800",
  },
  rose: {
    bar: "bg-rose-500 text-rose-50",
    foldBorder: "border-t-rose-800",
  },
};

/**
 * Diagonal corner ribbon in the style of the Pro Tailwind / Badass.dev
 * recipe — a rotated banner draped over the top-right corner of a card,
 * with two darker triangular "fold" tabs simulating the ribbon wrapping
 * around the card edges.
 *
 * IMPORTANT: the host card must be `position: relative` and MUST NOT
 * use `overflow: hidden`; the ribbon body and its fold tabs intentionally
 * extend past the corner.
 */
export function CornerRibbon({ label, tone = "amber" }: Props) {
  const t = TONES[tone];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-3 top-5 z-10 rotate-45"
    >
      <div
        className={cn(
          "relative px-7 py-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] shadow-md",
          t.bar
        )}
      >
        {label}
        {/* Fold tab below the bar's left end — after rotation this
            appears above the card's top edge, reading as the ribbon
            tucking underneath. */}
        <div
          className={cn(
            "absolute left-0 top-full h-0 w-0 border-l-[6px] border-t-[6px] border-l-transparent",
            t.foldBorder
          )}
        />
        {/* Mirror tab at the bar's right end — after rotation appears
            to the right of the card's right edge. */}
        <div
          className={cn(
            "absolute right-0 top-full h-0 w-0 border-r-[6px] border-t-[6px] border-r-transparent",
            t.foldBorder
          )}
        />
      </div>
    </div>
  );
}
