import { cn } from "@/lib/utils";

interface Props {
  /** Short label rendered inside the ribbon (e.g. BETA, NUEVO, PRO). */
  label: string;
  /** Color preset. Falls back to amber. */
  tone?: "amber" | "emerald" | "blue" | "rose";
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  amber:
    "bg-amber-400 text-amber-950 ring-amber-500/40 [&_+_div]:bg-amber-500",
  emerald:
    "bg-emerald-500 text-emerald-50 ring-emerald-600/40 [&_+_div]:bg-emerald-600",
  blue: "bg-blue-500 text-blue-50 ring-blue-600/40 [&_+_div]:bg-blue-600",
  rose: "bg-rose-500 text-rose-50 ring-rose-600/40 [&_+_div]:bg-rose-600",
};

/**
 * Diagonal corner ribbon for the top-right of a positioned container.
 *
 * Mount inside any element that has `position: relative` and
 * `overflow-hidden` (a Card works perfectly). The wrapper sets up the
 * square mask and the inner bar rides at 45° anchored to the corner.
 * Pattern adapted from the Pro Tailwind / Badass.dev flexible ribbon
 * tutorial.
 */
export function CornerRibbon({ label, tone = "amber" }: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 z-10 h-12 w-12 overflow-hidden"
    >
      <div
        className={cn(
          "absolute right-[-22px] top-[14px] w-[88px] rotate-45 py-0.5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] shadow-md ring-1",
          TONES[tone]
        )}
      >
        {label}
      </div>
    </div>
  );
}
