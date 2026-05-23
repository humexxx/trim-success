import { useAuth } from "src/context/hooks";

/** Emails that get the DEMO ribbon — keep in sync with seed-demo-accounts. */
const DEMO_EMAILS = new Set([
  "demo@trim-success.test",
  "admin@trim-success.test",
  "demo@trim-success.app",
]);

/**
 * Diagonal corner ribbon stuck to the viewport's top-right that reads
 * "DEMO". Surfaces when (a) the app is running in dev OR (b) the
 * signed-in user is one of the seed accounts — so it never shows for
 * a real customer in production. The wrapper is `pointer-events-none`
 * so the ribbon never blocks clicks on header buttons underneath it.
 *
 * Pattern adapted from Pro Tailwind / Badass.dev's flexible ribbon
 * tutorial: a square mask with overflow-hidden anchors a rotated bar
 * whose dimensions are independent of the mask size.
 */
export function DemoRibbon() {
  const { currentUser } = useAuth();

  const isDev = import.meta.env.DEV;
  const isDemoUser =
    !!currentUser?.email && DEMO_EMAILS.has(currentUser.email);

  if (!isDev && !isDemoUser) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 z-50 h-28 w-28 overflow-hidden"
    >
      <div
        className="absolute right-[-46px] top-[26px] w-[170px] rotate-45 bg-amber-400 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-950 shadow-md ring-1 ring-amber-500/40"
      >
        Demo
      </div>
    </div>
  );
}
