import { ReactNode } from "react";

import { Link } from "react-router-dom";

import heroImage from "@/assets/images/hero.webp";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  /** Optional className applied to the form column (use for max-w tweaks). */
  className?: string;
}

/**
 * Two-column auth shell adapted from shadcn's login-02 block: brand + form
 * on the left, hero on the right (hidden < lg). Used by sign-in, sign-up
 * and forgot-password so spacing, brand mark and hero stay in sync.
 */
export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            ScorChain
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={cn("w-full max-w-sm", className)}>{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
